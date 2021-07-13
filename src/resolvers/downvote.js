// import upvote from "./upvote";

// const Mutation = {
//     /**
//      * Creates a vote for post
//      *
//      * @param {string} userId
//      * @param {string} postId
//      */
//     createdownVote: async (root, { input: { userId, postId } }, { DownVote, Post, User,Vote }) => {
//       const downVote = await new DownVote({ user: userId, post: postId }).save();
      
//       // on downvote reduce one from vote count
//       await Vote.findOneAndUpdate({ $inc: {votes: -1} }); 
//       // Push vote to post collection
//       await Post.findOneAndUpdate({ _id: postId }, { $push: { downvotes: downVote.id } });
//       // Push vote to user collection
//       await User.findOneAndUpdate({ _id: userId }, { $push: { downvotes: downVote.id } });
  
//       return downVote;
//     },
//     /**
//      * Deletes a post vote
//      *
//      * @param {string} id
//      */
//     deletedownVote: async (root, { input: { id } }, { DownVote,UpVote, User, Post,Vote }) => {
//       const downVote = await DownVote.findByIdAndRemove(id);
      
//       const upVote = await new UpVote.findOneAndUpdate({ user: userId, post: postId })
//       // on removing downvote increment one 
//       await Vote.findOneAndUpdate({ $inc: {votes: 1} }); 
      
//       // add vote to users collection
//       await User.findOneAndUpdate({_id: upvote.user}, {$push: {upvotes: upVote.id}});

//       // add vote to posts collection
//       await Post.findOneAndUpdate({_id: upvote.post },{$push: {upvotes: upVote.id}}); 

//       // Delete vote from users collection
//       await User.findOneAndUpdate({ _id: downvote.user }, { $pull: { downvotes: downVote.id } });
      
//       // Delete vote from posts collection
//       await Post.findOneAndUpdate({ _id: downvote.post }, { $pull: { downvotes: downVote.id } });
  
//       return downVote,upVote;
//     },
//   };
  
//   export default { Mutation };