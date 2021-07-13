import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Vote Schema refrences to DownVote and UpVote
 */
const clapSchema = Schema(
    {   
        user : {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        post : {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        },
    },
    {
        timestamps: true
    }
);
export default mongoose.model('Clap', clapSchema);