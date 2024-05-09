import React, { useState, useEffect } from 'react';
import AdminMovieMenu from '../../components/Layout/AdminMovieMenu';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Select } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import LayoutAdmin from './../../components/Layout/LayoutAdmin';

const { Option } = Select;

const AddMovieSchedule = () => {
  const [movies, setMovies] = useState([]);
  const [date, setDate] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [movie, setMovie] = useState('');
  const [unavailableSeats, setUnavailableSeats] = useState('');
  const [errors, setErrors] = useState({
    date: '',
    from: '',
    to: '',
    movie: '',
  });

  // get all movies
  const getAllMovies = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/v1/movies/get-movie');
      if (data?.success) {
        setMovies(data?.movies);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something wrong in getting category');
    }
  };

  useEffect(() => {
    getAllMovies();
  }, []);

  // create schedule function
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Check if there is any existing schedule that overlaps with the selected time period
      const existingSchedules = await axios.get(`http://localhost:8080/api/v1/movieschedule/get-schedule-date/${date}`);
      const overlappingSchedule = existingSchedules.data.movieSchedules.find(schedule => {
        const scheduleStartTime = new Date(`${date}T${schedule.from}`);
        const scheduleEndTime = new Date(`${date}T${schedule.to}`);
        const newStartTime = new Date(`${date}T${from}`);
        const newEndTime = new Date(`${date}T${to}`);
        return (newStartTime >= scheduleStartTime && newStartTime < scheduleEndTime) || (newEndTime > scheduleStartTime && newEndTime <= scheduleEndTime);
      });

      if (overlappingSchedule) {
        toast.error('A schedule already exists for the selected time period');
        return;
      }

      const movieScheduleData = new FormData();
      movieScheduleData.append('date', date);
      movieScheduleData.append('from', from);
      movieScheduleData.append('to', to);
      movieScheduleData.append('movie', movie);
      movieScheduleData.append('unavailable_seats', unavailableSeats);

      const { data } = await axios.post('http://localhost:8080/api/v1/movieschedule/create-schedule', movieScheduleData);

      if (data?.success) {
        toast.success('Movie scheduled successfully');
        // Clear form fields
        setDate('');
        setFrom('');
        setTo('');
        setMovie('');
        setUnavailableSeats('');
        setErrors({
          date: '',
          from: '',
          to: '',
          movie: '',
        });
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = { date: '', from: '', to: '', movie: '' };

    if (!date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }
    if (!from) {
      newErrors.from = 'From time is required';
      isValid = false;
    }
    if (!to) {
      newErrors.to = 'To time is required';
      isValid = false;
    }
    if (!movie) {
      newErrors.movie = 'Movie is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <LayoutAdmin>
    <div className="container-fluid m-4 p-3">
      <div className="row">
        <div className="col-md-3">
          <AdminMovieMenu />
        </div>
        <div className="col-md-9 ">
          <h3 className="text-center"><legend>Schedule Movie Showtime</legend></h3>

          <div className="m-1 w-75 ">
            <label>Select a date :</label>
            <div className="mb-3">
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]} // Set min attribute to current date
              placeholder="date"
              className={`form-control ${errors.date && 'is-invalid'}`}
              onChange={(e) => setDate(e.target.value)}
            />
              {errors.date && <div className="invalid-feedback">{errors.date}</div>}
            </div>

            <label>From :</label>
            <div className="mb-3">
              <input
                type="time"
                value={from}
                placeholder="start time"
                className={`form-control ${errors.from && 'is-invalid'}`}
                onChange={(e) => setFrom(e.target.value)}
              />
              {errors.from && <div className="invalid-feedback">{errors.from}</div>}
            </div>

            <label>To:</label>
            <div className="mb-3">
              <input
                type="time"
                value={to}
                placeholder="end time"
                className={`form-control ${errors.to && 'is-invalid'}`}
                onChange={(e) => setTo(e.target.value)}
              />
              {errors.to && <div className="invalid-feedback">{errors.to}</div>}
            </div>

            <label>Movie :</label>
            <Select
              variant={false}
              placeholder="Select a movie"
              size="large"
              showSearch
              className={`form-select mb-3 ${errors.movie && 'is-invalid'}`}
              onChange={(value) => {
                setMovie(value);
              }}
            >
              {movies?.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>
            {errors.movie && <div className="invalid-feedback">{errors.movie}</div>}

            <label>Unavailable seats :</label>
            <div className="mb-3">
              <input
                type="text"
                value={unavailableSeats}
                placeholder="Unavailable seats"
                className="form-control"
                onChange={(e) => {
                  const value = e.target.value;
                  // Check if the input contains only numbers and commas
                  if (/^[0-9,]*$/.test(value)) {
                    setUnavailableSeats(value); // Set the value if it contains only numbers and commas
                  }
                  }}
              />
            </div>

            <br />

            <div className="mb-3 d-flex justify-content-center">
              <button className="btn btn-primary" onClick={handleCreate}>
                Schedule Showtime
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
    </LayoutAdmin>
  );
};

export default AddMovieSchedule;
