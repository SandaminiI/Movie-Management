import movieCategoryModel from "../models/movieCategoryModel.js";
import slugify from "slugify";

export const createMovieCategoryController = async(req,res) => {
    try {
        const {name} = req.body
        if(!name){
            return res.status(401).send({message:'Name is required'})
        }
        const existingCategory = await movieCategoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:'Category Already exists'
            })
        }
        const category = await new movieCategoryModel({name, slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:'New category created',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in category'
        })
    }
};

//update category
export const updateMovieCategoryController = async (req,res) => {
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await movieCategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:'Category Updated successfully',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while updating category'
        })
    }
};

//get all category
export const movieCategoryController = async(req,res) => {
    try {
        const category = await movieCategoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All Category List",
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting all categories'
        })
    }
};

//get single category
export const singleMovieCategoryController = async (req,res) => {
    try {
        const category = await movieCategoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Get single category successfully",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while gettinh single category"
        })
    }
};



export const deleteMovieCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the movie category by ID and delete it
        const deletedCategory = await movieCategoryModel.findByIdAndDelete(id);

        // Check if a category was found and deleted
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error(error);
        // Return error response
        return res.status(500).json({
            success: false,
            message: 'Error while deleting category',
            error: error.message
        });
    }
};