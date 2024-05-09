import React, { useState, useEffect } from 'react';
import Layout from './../components/Layout/Layout';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import badminton from './../assets/badminton.jpg';
import cricket from './../assets/cricket.jpg';
import pooling from './../assets/pooling.jpg';
import pottery from './../assets/pottery.jpg';
import tabletennis from './../assets/tabletennis.jpg';
import cinema from './../assets/cinema.jpg';
import games from './../assets/games.png';
import swim from './../assets/swim.jpg';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  

  // Get all movies
  const getAllMovies = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/movies/get-movie");
      setMovies(data.movies);
    } catch (error) {
      console.log(error);
      // Handle error using toast
      toast.error("Something went wrong");
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllMovies();
  }, []);

  return (
    <Layout title={"Home Page"}>
<div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active" data-bs-interval={10000}>
      <img src={cinema} className="d-block w-100" alt="..." style={{ maxHeight: "350px" }} />
    </div>
    <div className="carousel-item" data-bs-interval={2000}>
      <img src={swim} className="d-block w-100" alt="..." style={{ maxHeight: "350px" }} />
    </div>
    <div className="carousel-item">
      <img src={games} className="d-block w-100" alt="..." style={{ maxHeight: "350px" }} />
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true" />
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true" />
    <span className="visually-hidden">Next</span>
  </button>
</div>



<div className="container-fluid m-2 p-4">
  <div className="text-center">
    <div className="box">
      <p className="box-text">
        "Discover the perfect blend of cinematic delight and exhilarating activities at our LEISUREHUB.
         From blockbuster movies to a wide array of games, there's something for everyone to enjoy.
         Experience the ultimate blend of entertainment and recreation, where every moment is tailored 
         to fulfill your leisure desires."
      </p>
    </div>
  </div>
</div>








      <div className='container-fluid m-2 p-4'>
        <div className='text-center'>
          <h2>Movies</h2>
          <div className='row row-cols-2 row-cols-md-5'>
            {movies.slice(0, 5).map(movie => (
              <div key={movie._id} className="col mb-4">
                <div className='card' style={{ width: "100%" }}>
                  <img src={`http://localhost:8080/api/v1/movies/movie-posterimage/${movie._id}`} className="card-img-top" alt={movie.name} />
                  <div className="card-body">
                    <h5 className="card-title">{movie.name}</h5>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

<div className='container-fluid m-2 p-4'>
  <div className='text-center'>
    <h2>Games & Activities</h2>
    <div className='row row-cols-2 row-cols-md-5'>
      <div className="col mb-4">
        <div className='card' style={{ width: "100%", height: "100%" }}>
          <img src={badminton} className="card-img-top" alt="Game 1" style={{ objectFit: "cover", height: "200px" }} />
          <div className="card-body" style={{ height: "100px", overflow: "hidden" }}>
            <h5 className="card-title">Badminton</h5>
          </div>
        </div>
      </div>
      <div className="col mb-4">
        <div className='card' style={{ width: "100%", height: "100%" }}>
          <img src={cricket} className="card-img-top" alt="Game 2" style={{ objectFit: "cover", height: "200px" }} />
          <div className="card-body" style={{ height: "100px", overflow: "hidden" }}>
            <h5 className="card-title">Cricket</h5>
          </div>
        </div>
      </div>
      <div className="col mb-4">
        <div className='card' style={{ width: "100%", height: "100%" }}>
          <img src={pooling} className="card-img-top" alt="Game 2" style={{ objectFit: "cover", height: "200px" }} />
          <div className="card-body" style={{ height: "100px", overflow: "hidden" }}>
            <h5 className="card-title">Pooling</h5>
          </div>
        </div>
      </div>
      <div className="col mb-4">
        <div className='card' style={{ width: "100%", height: "100%" }}>
          <img src={pottery} className="card-img-top" alt="Game 2" style={{ objectFit: "cover", height: "200px" }} />
          <div className="card-body" style={{ height: "100px", overflow: "hidden" }}>
            <h5 className="card-title">Pottery</h5>
          </div>
        </div>
      </div>
      <div className="col mb-4">
        <div className='card' style={{ width: "100%", height: "100%" }}>
          <img src={tabletennis} className="card-img-top" alt="Game 2" style={{ objectFit: "cover", height: "200px" }} />
          <div className="card-body" style={{ height: "100px", overflow: "hidden" }}>
            <h5 className="card-title">Table Tennis</h5>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>

<div className="container-fluid m-2 p-4">
  <div className="text-center">
    <div className="box">
      <p className="box-text2">
        <b>Register Now As a memeber</b><br/>
        While you don't have to be a registered member to buy a movie ticket,
         registered members can both enjoy movies and play games & activities.
      </p>
      <button className="register-button">Register Now</button>
    </div>
  </div>
</div>
      <Toaster />
    </Layout>
  );
};

export default HomePage;
