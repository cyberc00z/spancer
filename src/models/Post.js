import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * Post Schema that has refrences to User, Vote, Comment Schemas
 */
const postSchema = Schema(
    {
        title: String,
        description: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        claps: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Clap'
            }
        ],
        comments:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    {
        timestamps: true,
    }
);
export default mongoose.model('Post', postSchema);