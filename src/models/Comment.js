import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        author:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
        claps: {
            type: Schema.Types.ObjectId,
            ref: 'Clap',
        }
    },
    {
        timestamps: true
    }
); 

export default mongoose.model('Comment' , commentSchema);