import mongoose,{Schema} from "mongoose";

const ProjectSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    ownerId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    completionStatus: {
        type: String,
        enum: ['pending', 'ongoing', 'completed'],
        default: 'pending'
    },
    haringStatus:{
        type: String,
        enum: ["haring","not_haring"],
        default: 'not_haring'
    },
    image:{
        type: String,   //url
    },
    link:{
        type: String,   //url
    }
    
},{timeseries:true});

const Project =  mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export default Project