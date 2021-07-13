const Mutation = {
    /**
     * Creates a bookmark 
     * @param {string} userId  
     * @param {string} postId  
     * 
     */
    createBookmark: async (root, {input: {postId, userId}}, { Bookmark ,Post, User}) => {
        if (!postId || postId===""){
            throw new Error("Post Not Found!")
        }
        if (!userId){
           throw new Error("BookMarker User not found!");
        }
        const bookmark = await new Bookmark({user: userId,  post: postId}).save();

        // Push bookmark to post collection
        await Post.findOneAndUpdate({_id: postId}, {$push: {bookmarks: bookmark.id}}) 
        // Push bookmark to user collection
        await User.findOneAndUpdate({_id: userId }, { $push: { bookmarks: bookmark.id  } })
        return bookmark;
    },

    /**
     * Deletes a bookmark from  corresponding users collection 
     *
     *  @param {string} id 
     */

    deleteBookmark: async (root, {input: { id }}, { Bookmark, User,Post }) => {
        const bookmark = await Bookmark.findByIdAndRemove(id)

        // remove bookmark from User collection
        await User.findOneAndUpdate({_id: bookmark.user}, {$pull: { bookmarks : bookmark.id }})
        await Post.findOneAndUpdate({_id: bookmark.post}, {$pull: {bookmarks: bookmark.id}})
        return bookmark;
    },
};
export default {Mutation};