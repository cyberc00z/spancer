// import mongoose from 'mongoose';

// const Schema = mongoose.Schema;

// /**
//  * UpVote Schema refrences to Post and User
//  */
// const upVoteSchema = Schema(
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
// export default mongoose.model('UpVote', upVoteSchema);