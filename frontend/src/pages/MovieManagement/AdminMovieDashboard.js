import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMovieMenu from '../../components/Layout/AdminMovieMenu';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDocument from './MovieAnalysis'; 
import LayoutAdmin from './../../components/Layout/LayoutAdmin';

const AdminMovieDashboard = () => {
    const [movieReport, setMovieReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieReport = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/movieschedule/generate-movie-report`); // Adjust the API endpoint as needed
                setMovieReport(response.data.report);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchMovieReport();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const sortedMovieSchedule = movieReport && movieReport.movieScheduleOverview && [...movieReport.movieScheduleOverview].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
  
    return (
        <LayoutAdmin title={"MovieDashboard"}>
        <div className='container-fluid m-4 p-2'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMovieMenu />
                </div>
                <div className='col-md-9'>
                    <h3><center>Movie Analysis</center></h3>
                    {movieReport && (
                        <div>
                            <p>Total Scheduling: {movieReport.totalMoviesScheduled}</p>
                            <p>Movies Scheduled Today: {movieReport.moviesScheduledToday.length}</p>
                            <p>Movies Scheduled Upcoming: {movieReport.moviesScheduledUpcoming.length}</p>
                            
                            <h5>Movies with Most Showtimes:</h5>
                            <ul>
                                {movieReport.moviesWithMostShowtimes.map(movie => (
                                    <li key={movie.movie}>{movie.movie}: {movie.totalShowtimes}</li>
                                ))}
                            </ul>
                            <h5>Movies with Fewest Showtimes:</h5>
                            <ul>
                                {movieReport.moviesWithFewestShowtimes.map(movie => (
                                    <li key={movie.movie}>{movie.movie}: {movie.totalShowtimes}</li>
                                ))}
                            </ul><br/>
                            <h5>Movie Schedule Overview:</h5>
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Movie</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedMovieSchedule.map((schedule, index) => (
                                        <tr key={schedule.movie}>
                                            <td>{index + 1}</td>
                                            <td>{schedule.movie}</td>
                                            <td>{formatDate(schedule.date)}</td>
                                            <td>{schedule.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <PDFDownloadLink document={<PdfDocument movieReport={movieReport} />} fileName="movie_Analysis_Report.pdf">
                                {({ blob, url, loading, error }) => (
                                    <button className="btn btn-primary" disabled={loading}>{loading ? 'Loading document...' : 'Download Report'}</button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </LayoutAdmin>
    );
};

export default AdminMovieDashboard;
