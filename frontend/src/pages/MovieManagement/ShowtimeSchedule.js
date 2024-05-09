import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMovieMenu from '../../components/Layout/AdminMovieMenu';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LayoutAdmin from './../../components/Layout/LayoutAdmin';

const ShowtimeSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSchedules(selectedDate);
    }, [selectedDate]);

    const fetchSchedules = async (date) => {
        try {
            setLoading(true);
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const formattedDate = utcDate.toISOString().split('T')[0];
            const { data } = await axios.get(`http://localhost:8080/api/v1/movieschedule/get-schedule-date/${formattedDate}`);
            if (data.success) {
                setSchedules(data.movieSchedules);
            } else {
                console.error('Failed to fetch schedules:', data.message);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        try {
            const confirmDelete = window.confirm('Do you want to delete this schedule?');
            if (confirmDelete) {
                const { data } = await axios.delete(`http://localhost:8080/api/v1/movieschedule/delete-movieschedule/${scheduleId}`);
                if (data.success) {
                    // Remove the deleted schedule from the state
                    setSchedules(prevSchedules => prevSchedules.filter(schedule => schedule._id !== scheduleId));
                    toast.success('Schedule deleted successfully');
                } else {
                    console.error('Failed to delete schedule:', data.message);
                }
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    return (
        <LayoutAdmin title={"Showtime"}>
        <div className='container-fluid m-4 p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMovieMenu />
                </div>
                <div className='col-md-9 '>
                    <h3 className="text-center">Movie Showtime Schedule</h3>
                    <div className="mb-3">
                        <label className="form-label">Select Date:</label>
                        <DatePicker
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                        />
                    </div>
                    <br /><br /><br />
                    <h5><center>Showtime Schedule for {selectedDate.toLocaleDateString('en-US')}</center></h5>
                    <br/>
                    
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {schedules.length === 0 ? (
                                <p>No schedules available for the selected date.</p>
                            ) : (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Movie</th>
                                            <th>Booked or Unavailable Seats</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.map(schedule => (
                                            <tr key={schedule._id}>
                                                <td>{schedule.from}</td>
                                                <td>{schedule.to}</td>
                                                <td>{schedule.movie.name}</td>
                                                <td>{schedule.unavailable_seats.join(' ')}</td>
                                                <td>
                                                    <button 
                                                        className='btn btn-danger'
                                                        onClick={() => handleDeleteSchedule(schedule._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
        </LayoutAdmin>
    );
};

export default ShowtimeSchedule;
