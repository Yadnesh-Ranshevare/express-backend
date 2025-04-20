import mongoose, {Schema} from "mongoose";

const profileSchema = new Schema({
    ownerId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    image:{
        type: String,   //url
    },
    links: [{
        type: String,
    }],
    project:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }
    ],
    skills:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Skill'
        }
    ]
},{timestamps: true});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;