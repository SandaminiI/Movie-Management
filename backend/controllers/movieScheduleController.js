import movieScheduleModel from "../models/movieScheduleModel.js"
import movieModel from "../models/movieModel.js";
import movieCategoryModel from "../models/movieCategoryModel.js";

// Controller function for creating a movie schedule
export const createMovieScheduleController = async (req, res) => {
    try {
        const {date,from,to,movie} = req.fields

        //validation
        switch(true){
            case !date:
                return res.status(500).send({error: 'date is required'})
            case !from:
                return res.status(500).send({error: 'from time is required'})
            case !to:
                return res.status(500).send({error: 'to time is required'})
            case !movie:
                return res.status(500).send({error: 'movie is required'}) 
                            
        }

        const movieschedule = new movieScheduleModel({...req.fields})
        
        await movieschedule.save()
        res.status(201).send({
            success:true,
            message: 'Movie schedule added successfully',
            movieschedule
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in creating schedule'
        })
    }
};



//get single movieschedule
export const getSingleMovieScheduleController = async(req,res) => {
    try {
        const movieschedule = await movieScheduleModel.findById(req.params.id)
        res.status(200).send({
            success:true,
            message:"One schedule fetched",
            movieschedule
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting single product',
            error
        })
    }
}



//get all movie schedules
export const getMovieScheduleController = async(req,res) => {
    try {
        const movieschedule = await movieScheduleModel.find()
        res.status(201).send({
            success:true,
            counTotal: movieschedule.length,
            message: "All movie schedule",
            movieschedule
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in getting movie schedules',
            error: error.message
        })
    }
}



// Controller function to get schedules based on date
export const getMovieSchedulesByDateController = async (req, res) => {
    try {
        const { date } = req.params;

        // Validate if date is provided
        if (!date) {
            return res.status(400).send({ error: 'Date is required' });
        }

        // Find all movie schedules for the given date and populate the movie field with movie details
        const movieSchedules = await movieScheduleModel.find({ date }).populate('movie');

        res.status(200).send({
            success: true,
            countTotal: movieSchedules.length,
            message: `Movie schedules for ${date}`,
            movieSchedules
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting movie schedules by date',
            error: error.message
        });
    }
};



//update movie schedule
export const updateMovieScheduleController = async (req, res) => {
    try {
        const { date, from, to, movie,unavailable_seats} = req.fields;

        // Validation
        switch (true) {
            case !date:
                return res.status(400).send({ error: 'Date is required' });
            case !from:
                return res.status(400).send({ error: 'Showtime "from" is required' });
            case !to:
                return res.status(400).send({ error: 'Showtime "to" is required' });
            case !movie:
                return res.status(400).send({ error: 'Movie is required' });
        }


        // Find and update movie schedule
        const movieschedule = await movieScheduleModel.findByIdAndUpdate(
            req.params.id,
            { date, from, to, movie, unavailable_seats },
            { new: true } // Returns the updated document
        );

        // Check if movie schedule is found
        if (!movieschedule) {
            return res.status(404).send({ error: 'Movie schedule not found' });
        }

        res.status(200).send({
            success: true,
            message: 'Movie schedule updated successfully',
            movieschedule
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error: error.message,
            message: 'Error in updating schedule'
        });
    }
};



//delete a movie schedule
export const deleteMovieScheduleController = async (req, res) => {
    try {
        // Find and delete the movie schedule by ID
        const deletedMovieSchedule = await movieScheduleModel.findByIdAndDelete(req.params.id);

        // Check if the movie schedule was found and deleted
        if (!deletedMovieSchedule) {
            return res.status(404).send({
                success: false,
                message: 'Movie schedule not found'
            });
        }

        // If successful, send success response
        res.status(200).send({
            success: true,
            message: 'Movie schedule deleted successfully'
        });
    } catch (error) {
        // Log and send error response if deletion fails
        console.error('Error deleting movie schedule:', error);
        res.status(500).send({
            success: false,
            message: 'Error while deleting movie schedule',
            error: error.message
        });
    }
};



// Function to generate a movie report
export const generateMovieReport = async (req, res) => {
    try {
        // Fetch all movie schedules
        const allSchedules = await movieScheduleModel.find().populate('movie');

        // Fetch all movies
        const allMovies = await movieModel.find();

        // Fetch all movie categories
        const allCategories = await movieCategoryModel.find();

        // Process data for the report
        const reportData = {
            totalMoviesScheduled: allSchedules.length,
            moviesScheduledToday: allSchedules.filter(schedule => isToday(new Date(schedule.date))),
            moviesScheduledUpcoming: getUpcomingMovies(allSchedules),
            moviesByGenre: getMoviesByGenre(allSchedules, allCategories),
            moviesWithMostShowtimes: getTopMoviesByShowtimes(allSchedules, 'desc'),
            moviesWithFewestShowtimes: getTopMoviesByShowtimes(allSchedules, 'asc'),
            movieScheduleOverview: allSchedules.map(schedule => ({
                movie: schedule.movie.name,
                date: schedule.date,
                time: `${schedule.from} - ${schedule.to}`,
                genre: schedule.movie.genre.name,
                availability: calculateAvailability(schedule.movie._id, allMovies, allSchedules)
            }))
        };

        // Send the report as response
        res.status(200).json({ success: true, report: reportData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error generating movie report', error: error.message });
    }
};

// Helper function to check if a date is today
const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear();
};

// Helper function to get upcoming movies
const getUpcomingMovies = (schedules) => {
    const today = new Date();
    return schedules.filter(schedule => new Date(schedule.date) > today);
};

// Helper function to get movies by genre
const getMoviesByGenre = (schedules, categories) => {
    const moviesByGenre = {};
    categories.forEach(category => {
        moviesByGenre[category.name] = schedules.filter(schedule => schedule.movie.genre._id.toString() === category._id.toString()).length;
    });
    return moviesByGenre;
};

// Helper function to get top movies by showtimes
const getTopMoviesByShowtimes = (schedules, order) => {
    const movieCounts = {};
    schedules.forEach(schedule => {
        const movieId = schedule.movie._id.toString();
        movieCounts[movieId] = (movieCounts[movieId] || 0) + 1;
    });
    const sortedMovies = Object.keys(movieCounts).sort((a, b) => order === 'desc' ? movieCounts[b] - movieCounts[a] : movieCounts[a] - movieCounts[b]);
    return sortedMovies.slice(0, 5).map(movieId => ({
        movie: schedules.find(schedule => schedule.movie._id.toString() === movieId).movie.name,
        totalShowtimes: movieCounts[movieId]
    }));
};

// Helper function to calculate availability of a movie
const calculateAvailability = (movieId, allMovies, allSchedules) => {
    const movie = allMovies.find(movie => movie._id.toString() === movieId.toString());
    const totalSeats = movie ? movie.seats : 0;
    const scheduledShowtimes = allSchedules.filter(schedule => schedule.movie._id.toString() === movieId.toString());
    const totalScheduledSeats = scheduledShowtimes.reduce((total, schedule) => total + schedule.unavailable_seats.length, 0);
    const availableSeats = totalSeats - totalScheduledSeats;
    return availableSeats;
};
