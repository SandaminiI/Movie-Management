import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { Checkbox } from 'antd';
import MovieSearchInput from '../../components/Form/MovieSearchInput';
import { useNavigate } from 'react-router-dom';

export const Movies = () => {
  const navigate = useNavigate();
  const [ongoingMovies, setOngoingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [moviecategories, setMovieCategories] = useState([]);
  const [checked, setChecked] = useState([]);

  // Fetch all movie categories
  const getAllMovieCategory = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/v1/moviecategory/get-moviecategory');
      if (data?.success) {
        setMovieCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMovieCategory();
  }, []);

  // Fetch all movies
  const getAllMovies = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/movies/get-movie");
      const currentDate = new Date();
      const ongoingMovies = [];
      const upcomingMovies = [];

      data.movies.forEach(movie => {
        const releaseDate = new Date(movie.release_date);
        if (releaseDate <= currentDate) {
          ongoingMovies.push(movie);
        } else {
          upcomingMovies.push(movie);
        }
      });

      setOngoingMovies(ongoingMovies);
      setUpcomingMovies(upcomingMovies);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMovies();
  }, []);

  // Handle filter
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter(item => item !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    filterMovies();
  }, [checked]);

  // Filter movies based on selected categories
  const filterMovies = async () => {
    try {
      const { data } = await axios.post(`http://localhost:8080/api/v1/movies/movie-filters`, { checked });
      const currentDate = new Date();
      const filteredOngoingMovies = [];
      const filteredUpcomingMovies = [];

      data.movies.forEach(movie => {
        const releaseDate = new Date(movie.release_date);
        if (releaseDate <= currentDate) {
          filteredOngoingMovies.push(movie);
        } else {
          filteredUpcomingMovies.push(movie);
        }
      });

      setOngoingMovies(filteredOngoingMovies);
      setUpcomingMovies(filteredUpcomingMovies);
    } catch (error) {
      console.log(error);
    }
  };

  // Check if a movie is released within the last 7 days
  const isNewRelease = (releaseDate) => {
    const currentDate = new Date();
    const movieReleaseDate = new Date(releaseDate);
    const timeDifference = Math.abs(currentDate.getTime() - movieReleaseDate.getTime());
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Calculate difference in days
    return daysDifference <= 7; // Consider movies released within 7 days as new releases
  };

  // Sort ongoing movies by release date (newest first)
  const sortedOngoingMovies = ongoingMovies.slice().sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

  return (
    <Layout title={"Movies"}>
      <div>
        <br />
        <MovieSearchInput />
        <div className='row mt-3'>
          <div className='col-md-2' style={{ marginLeft: '20px' }}>
            <h4 className='text-center'>Filter by genre</h4>
            <div className='d-flex flex-column'>
              {moviecategories?.map((c) => (
                <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                  {c.name}
                </Checkbox>
              ))}
            </div>
            <div>
              <br/>
              <button className='btn btn-danger' onClick={()=> window.location.reload()}>
                RESET FILTER
              </button>
            </div>
          </div>
          <div className='col-md-9'>
            <h2 className='text-center'>Now showing</h2>
            {sortedOngoingMovies.length === 0 ? (
              <p className="text-center">No ongoing movies available</p>
            ) : (
              <div className='row row-cols-1 row-cols-md-3 g-4'>
                {sortedOngoingMovies?.map(p => (
                  <div key={p._id} className="col">
                    <div className="card">
                      {isNewRelease(p.release_date) && <span className="badge bg-warning position-absolute top-0 start-0">New Release</span>}
                      <img src={`http://localhost:8080/api/v1/movies/movie-posterimage/${p._id}`} className="card-img-top" alt={p.name} />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">{p.language}</p>
                        <div className='d-flex justify-content-center'>
                          <button className='btn btn-primary ms-3'
                            onClick={() => navigate(`/moviedetails/${p.slug}`)}
                          >
                            More Info
                          </button>
                          <button className='btn btn-secondary ms-3'>Book Now</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <br/><br/>
            <h2 className='text-center'>Coming Soon</h2>
            {upcomingMovies.length === 0 ? (
              <p className="text-center">No upcoming movies available</p>
            ) : (
              <div className='row row-cols-1 row-cols-md-3 g-4'>
                {upcomingMovies?.map(p => (
                  <div key={p._id} className="col">
                    <div className="card">
                      <img src={`http://localhost:8080/api/v1/movies/movie-posterimage/${p._id}`} className="card-img-top" alt={p.name} />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">{p.language}</p>
                        <div className='d-flex justify-content-center'>
                          <button className='btn btn-primary ms-3'
                            onClick={() => navigate(`/moviedetails/${p.slug}`)}
                          >
                            More Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <br />
      </div>
      <br/><br/>
    </Layout>
  );
};
