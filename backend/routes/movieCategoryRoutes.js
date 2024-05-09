import express from 'express'
import { createMovieCategoryController, deleteMovieCategoryController, movieCategoryController, singleMovieCategoryController, updateMovieCategoryController} from '../controllers/movieCategoryController.js'

const router = express.Router()

//routes
//create category
router.post('/create-moviecategory',createMovieCategoryController )

//update category
router.put('/update-moviecategory/:id',updateMovieCategoryController )

//get all category
router.get('/get-moviecategory', movieCategoryController )

//get single category
router.get('/single-category/:slug', singleMovieCategoryController )

//delete category
router.delete('/delete-moviecategory/:id',deleteMovieCategoryController )

export default router
