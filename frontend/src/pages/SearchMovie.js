import React from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/search'
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();

    return (
        <Layout title={"Search Results"}>
            <br />
            <div className='container'>
                <div className='text-center'>
                    <h2>Search Results</h2>
                    <h6>
                        {values?.results.length < 1
                            ? 'No Movies Found'
                            : ` ${values?.results.length} related movies`}
                    </h6>
                    <div className='row row-cols-1 row-cols-md-4'>
                        {values?.results.map(p => (
                            <div key={p._id} className="col mb-4">
                                <div className='card' style={{ width: "100%" }}>
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
                </div>
            </div>
            <br />
            <br /><br />
        </Layout>
    )
}
export default Search
