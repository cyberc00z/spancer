import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * BookMark Schema that has link to User and Post 
*/
const bookmarkSchema = Schema(
    {   
        post: {
           type: Schema.Types.ObjectId,
           ref : 'Post'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },    
    },
    {
        timestamps: true 
    }
);
export default mongoose.model('Bookmark',bookmarkSchema);