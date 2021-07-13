// import mongoose from 'mongoose';

// const Schema = mongoose.Schema;

// /**
//  * Down Vote Schema refrences to Post and User
//  */
// const downVoteSchema = Schema(
//     {
//         post: {
//             type: Schema.Types.ObjectId,
//             ref: 'Post',
//         },
//         user: {
//             type: Schema.Types.ObjectId,
//             ref: 'User',
//         },

//     },
//     {
//         timestamps: true
//     }
// );
// export default mongoose.model('DownVote', downVoteSchema);