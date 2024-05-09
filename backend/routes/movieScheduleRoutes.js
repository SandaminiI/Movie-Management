import express from 'express'
import { createMovieScheduleController, deleteMovieScheduleController, generateMovieReport, getMovieScheduleController, getMovieSchedulesByDateController, getSingleMovieScheduleController, updateMovieScheduleController } from '../controllers/movieScheduleController.js'
import formidable from 'express-formidable'

const router = express.Router()

//routes
//add movie schedule
router.post('/create-schedule',formidable(),createMovieScheduleController )

//get single movie schedule
router.get('/get-singleschedule/:id',getSingleMovieScheduleController )

//get schedules based on date
router.get('/get-schedule-date/:date',getMovieSchedulesByDateController )

//get movie schedule
router.get('/get-movieschedule', getMovieScheduleController )

//update movie schedule
router.put('/update-movieschedule/:id',formidable(),updateMovieScheduleController )

//delete movie schedule
router.delete('/delete-movieschedule/:id',deleteMovieScheduleController )

//generate report
router.get('/generate-movie-report', generateMovieReport);


export default router



