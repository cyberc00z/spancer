const Mutation = {
    /**
     * Create a upvote for post
     *
     * @param {string} userId
     * @param {string} postId
     */
    createClap: async (root, { input: { userId, postId } }, { Clap ,Post, User }) => {
      if (!userId && userId===""){
        throw new Error("Can't find User! ");
      }
      if (!postId && postId===""){
        throw new Error("Can't find Post! ");
      }
      const clap = await new Clap({ user: userId, post: postId }).save();
    
      // Push vote to post collection
      await Post.findOneAndUpdate({ _id: postId }, { $push: { claps: clap.id } });
      // Push vote to user collection
      await User.findOneAndUpdate({ _id: userId }, { $push: { claps : clap.id } });
  
      return clap;
    },
    /**
     * Deletes a uppost vote
     *
     * @param {string} id
     */
    removeClap: async (root, { input: { id } }, {  Clap,User, Post }) => {

      const clap = await Clap.findByIdAndRemove(id)
      // delete upvote from users collection
      await User.findOneAndUpdate({_id: clap.user}, {$pull: { claps: clap.id }});
      // delete upvote from posts collection
      await Post.findOneAndUpdate({_id: clap.post}, {$pull: { claps: clap.id }});
  
      return clap;
    },
  };
  
  export default { Mutation };