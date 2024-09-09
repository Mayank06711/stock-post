import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema(
    {
        stock: // if we like a video
        {
            type:Schema.Types.ObjectId,
            ref:"Stock"
        },
        likedBy: // who liked
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },{timestamps:true})

export const Like = mongoose.model("Like", likeSchema);
