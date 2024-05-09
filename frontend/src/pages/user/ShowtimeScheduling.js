import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout'
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';

const ShowtimeScheduling = () => {
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSchedules(selectedDate);
    }, [selectedDate]);

    const fetchSchedules = async (date) => {
        try {
            setLoading(true);
            const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
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

    return (
        <Layout title={"ShowTimes"}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <h3 className="text-center">Movie Showtimes</h3><br/>
                    <div className='col-md-10 mx-auto '>
                        <div className="mb-3">
                            <label className="form-label"><h5>Select Your Preferred Date:</h5></label>
                            <DatePicker
                                value={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                            />
                        </div>
                        <br /><br />
                        <h5><center>Showtime Schedule for {selectedDate.toLocaleDateString('en-US')}</center></h5>
                        <br/>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                {schedules.length === 0 ? (
                                    <p>No showtime available for the selected date.</p>
                                ) : (
                                    <table className="table table-striped ">
                                        <thead>
                                            <tr>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Movie</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedules.map(schedule => (
                                                <tr key={schedule._id}>
                                                    <td>{schedule.from}</td>
                                                    <td>{schedule.to}</td>
                                                    <td>{schedule.movie.name}</td> {/* Display movie name */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <br/><br/>
        </Layout>
    );
};

export default ShowtimeScheduling;
