import React, { useState, useEffect } from 'react';
import AdminMovieMenu from '../../components/Layout/AdminMovieMenu';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import LayoutAdmin from './../../components/Layout/LayoutAdmin';

const Movie = () => {
    const [movies, setMovies] = useState([]);

    //get all movies
    const getAllMovies = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/api/v1/movies/get-movie");
            setMovies(data.movies)
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    //lifecycle method
    useEffect(() => {
        getAllMovies();
    }, []);

    return (
        <LayoutAdmin title={"Movies"}>
        <div className='container-fluid m-2 p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMovieMenu />
                </div>
                <div className='col-md-9'>
                    <h2 className='text-center'>All Movie List</h2>
                    
                    <div className='row row-cols-1 row-cols-md-4 g-4'>
                        {movies?.map(p => (
                            <div key={p._id} className="col">
                                <Link to={`/adminmoviedashboard/moviemanagement/movie/${p.slug}`} className='movie-link'>
                                    
                                    <div className="card m-2" style={{ width: '12rem', height: '17rem', overflow: 'hidden' }}>
                                        <img src={`http://localhost:8080/api/v1/movies/movie-posterimage/${p._id}`} className="card-img-top" alt={p.name} style={{ width: '100%', height: '15rem', objectFit: 'cover' }} />
                                        <div className="card-body">
                                            
                                            <h5 className="card-title text-truncate">{p.name}</h5>
                                            
                                            <p className="card-text text-truncate">{p.language}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
        </LayoutAdmin>
    );
}

export default Movie;
