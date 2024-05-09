import mongoose from 'mongoose'

const scheduleSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    movie:{
        type:mongoose.ObjectId,
        ref:'movies',
        required:true
    },
    unavailable_seats: {
        type: [String], 
        
      }      
},{timestamps:true}
);


export default mongoose.model('movieschedule',scheduleSchema)