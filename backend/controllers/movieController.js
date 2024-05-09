import slugify from "slugify"
import movieModel from "../models/movieModel.js"
import fs from 'fs'

//add movies
export const createMovieController = async(req,res) => {
    try {
        const {name,slug,genre,language,director,producer,music,release_date,description} = req.fields
        const {poster_image} = req.files

        //validation
        switch(true){
            case !name:
                return res.status(500).send({error: 'Name is required'})
            case !genre:
                return res.status(500).send({error: 'Genre is required'})
            case !language:
                return res.status(500).send({error: 'Language is required'})
            case !director:
                return res.status(500).send({error: 'Director is required'}) 
            case !producer:
                return res.status(500).send({error: 'Producer is required'}) 
            case !music:
                return res.status(500).send({error: 'Music is required'})
            case !release_date:
                return res.status(500).send({error: 'Relaase_date is required'}) 
            case !description:
                return res.status(500).send({error: 'Description is required'}) 
            case poster_image && poster_image.size > 1000000:
                return res.status(500).send({error: 'photo is required and less than 1mb'})                       
        }

        const movies = new movieModel({...req.fields, slug:slugify(name)})
        if(poster_image){
            movies.poster_image.data = fs.readFileSync(poster_image.path)
            movies.poster_image.contentType = poster_image.type
        }

        await movies.save()
        res.status(201).send({
            success:true,
            message: 'Movie added successfully',
            movies
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in creating products'
        })
    }
}

//get all movies
export const getMovieController = async(req,res) => {
    try {
        const movies = await movieModel.find({}).populate('genre').select("-poster_image").limit(20).sort({createdAt:-1})
        res.status(201).send({
            success:true,
            counTotal: movies.length,
            message: "All movies",
            movies
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in getting movies',
            error: error.message
        })
    }
}

//get single movie
export const getSingleMovieController = async(req,res) => {
    try {
        const movie = await movieModel.findOne({slug:req.params.slug}).select("-poster_image").populate('genre')
        res.status(200).send({
            success:true,
            message:"One movie fetched",
            movie
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

//get poster image
export const moviePosterimageController = async (req,res) => {
    try {
        const movie = await movieModel.findById(req.params.mid).select("poster_image")
        if(movie.poster_image.data){
            res.set('Content-type',movie.poster_image.contentType)
            return res.status(200).send(movie.poster_image.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Error while gatting poster image',
            error
        })
    }
}

//delete movie
export const deleteMovieController = async (req,res) => {
    try {
        await movieModel.findByIdAndDelete(req.params.mid).select("-poster_image")
        res.status(200).send({
            success: true,
            message: 'Movie deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while deleting',
            error
        })
    }
}

//update movie
export const updateMovieController =async(req,res) =>{
    try {
        const {name,slug,genre,language,director,producer,music,release_date,description} = req.fields
        const {poster_image} = req.files

        //validation
        switch(true){
            case !name:
                return res.status(500).send({error: 'Name is required'})
            case !genre:
                return res.status(500).send({error: 'Genre is required'})
            case !language:
                return res.status(500).send({error: 'Language is required'})
            case !director:
                return res.status(500).send({error: 'Director is required'}) 
            case !producer:
                return res.status(500).send({error: 'Producer is required'}) 
            case !music:
                return res.status(500).send({error: 'Music is required'})
            case !release_date:
                return res.status(500).send({error: 'Relaase_date is required'}) 
            case !description:
                return res.status(500).send({error: 'Description is required'}) 
            case poster_image && poster_image.size > 1000000:
                return res.status(500).send({error: 'photo is required and less than 1mb'})                       
        }

        const movies = await movieModel.findByIdAndUpdate(req.params.mid,{...req.fields, slug:slugify(name)},{new:true})
        if(poster_image){
            movies.poster_image.data = fs.readFileSync(poster_image.path)
            movies.poster_image.contentType = poster_image.type
        }

        await movies.save()
        res.status(201).send({
            success:true,
            message: 'Movie updated successfully',
            movies
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in updating products'
        })
    }
}

//filter movies
export const movieFiltersController = async(req,res) => {
    try {
        const { checked} =req.body;
        let args = {};
        if (checked.length > 0) args.genre = checked;

        const movies = await movieModel.find(args)
        res.status(200).send({
            success:true,
            movies,
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"Error while filtering products",
            error
        })
    }
} 


//search movie
export const searchMovieController =async (req,res) => {
    try {
        const {keyword} = req.params;
        const results = await movieModel.find({
            $or: [
                {name:{$regex :keyword, $options:"i"}},
                {language:{$regex :keyword, $options:"i"}},
                {description:{$regex :keyword, $options:"i"}}
            ]
        }).select("-poster_image");
        res.json(results);
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message: 'Error in searching movie',
            error
        })
    }
}


//similar movies
export const relatedMovieController = async (req,res) => {
    try {
        const {mid,cid} = req.params
        const movies = await movieModel.find({
            genre:cid,
            _id:{$ne:mid},
        })
        .select("-poster_image")
        .limit(3)
        .populate("genre");
        res.status(200).send({
            success:true,
            movies
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'error while getting related movies',
            error
        })
    }
}