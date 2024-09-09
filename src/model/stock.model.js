import mongoose, {Schema} from "mongoose";

const stockSchema = new Schema({
    smybol:{
        type: String,
        required: [true, "Symbol for stock post is required"],
        unique: true
    },
    title:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    tags:{
        type: [String],
        default: "Stock"
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps:true});

export const Stock = mongoose.model('Stock', stockSchema);

