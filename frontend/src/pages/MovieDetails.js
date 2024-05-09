import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MovieDetails = () => {
  const params = useParams();
  const [movie, setMovie] = useState({});
  const [relatedMovies, setRelatedMovies] = useState([]);

  // Initial details
  useEffect(() => {
    if (params?.slug) getMovie();
  }, [params?.slug]);

  // Get movie
  const getMovie = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/v1/movies/get-movie/${params.slug}`);
      setMovie(data?.movie);
      getSimilarMovies(data?.movie._id, data?.movie.genre._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Format release date
  const formatDate = (date) => {
    const releaseDate = new Date(date);
    const year = releaseDate.getFullYear();
    const month = String(releaseDate.getMonth() + 1).padStart(2, '0');
    const day = String(releaseDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get similar movies
  const getSimilarMovies = async (mid, cid) => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/v1/movies/related-movies/${mid}/${cid}`);
      setRelatedMovies(data?.movies);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"Movie details"}>
      <div>
        <div className='row container mt-5 '>
          <div className='col-md-5 ' style={{ marginLeft: '20px' }}>
            <img src={`http://localhost:8080/api/v1/movies/movie-posterimage/${movie._id}`}
              className="card-img-top"
              alt={movie.name}
              height="450"
              width={"250px"} />
          </div>
          <div className='col-md-6' style={{ marginLeft: '20px' }}>
            <h2 className='text-center'>Movie Details</h2>
            <p><b>Movie Title : </b>{movie.name}</p>
            <p><b>Language : </b>{movie.language}</p>
            <p><b>Genre : </b>{movie?.genre?.name}</p>
            <p><b>Director : </b>{movie.director}</p>
            <p><b>Producer : </b>{movie.producer}</p>
            <p><b>Music Composer : </b>{movie.music}</p>
            <p><b>Release Date : </b>{formatDate(movie.release_date)}</p>
            <p><b>Description : </b>{movie.description}</p>

            <center>
              <button className="btn btn-primary ms-3">BOOK NOW</button>
              <button className="btn btn-secondary ms-3">Rate Now</button>
            </center>
          </div>
        </div>
        <br/><br/><br/>
        <div className='row'>
          <h4><center>Similar Movies</center></h4>
          {relatedMovies.length > 0 ? (
            <div className='row row-cols-1 row-cols-md-4 g-4' style={{ marginLeft: '20px' }}>
              {relatedMovies.map(p => (
                <div key={p._id} className="col">
                  <div className="card">
                    <img src={`http://localhost:8080/api/v1/movies/movie-posterimage/${p._id}`} className="card-img-top" alt={p.name} />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.language}</p>
                      <div className='d-flex justify-content-center'></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No available similar type movies</p>
          )}
        </div>
        <br />
      </div>
      <br /><br />
    </Layout>
  );
};

export default MovieDetails;
