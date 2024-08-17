import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        userId:{
            type:String,
            required:true
        },
        thumbnail:{
            type:String,   //cloudinary
            required:true
        },
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        desc : {
            type:String,
            required:true
        },
        duration:{
            type:String,
            required:true
        },
        views: {
            type: Number,
            default: 0
        },
        tags:{
            type:[String],
            default:[]
        },
        likes:{
            type:[String],
            default:[]
        },
        dislikes:{
            type:[String],
            default:[]
        }
        

    }, 
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)