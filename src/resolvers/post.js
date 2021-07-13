const Query = {
    /**
     * Gets all posts
     *
     * @param {string} authUserId
     * @param {int} skip how many posts to skip
     * @param {int} limit how many posts to limit
     */
    
    
    getPosts: async (root, { authUserId, skip, limit }, { Post }) => {
      const query = {
        $and: [{ image: { $ne: null } }, { author: { $ne: authUserId } }],
      };
      const postsCount = await Post.find(query).countDocuments();
      const allPosts = await Post.find(query)
        .populate({
            path: 'author',
            populate: [
                {
                    path : 'notifications',
                    populate: [{path: 'author'}, {path:'clap'} ,{path : 'comment' }]
                },
            ],
        })
        .populate('claps')
        .populate({
            path: 'comments',
            options: { sort: { createdAt:'desc' } },
            populate: [{ path: 'author' },{path: 'clap'}, {path: 'comments'}]
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt:'desc' });
    
    return { posts: allPosts, count: postsCount };
    },

    /**
      * Gets posts by id 
    */
   getPost: async (root, { id },{Post}) => {
       const post = await Post.findById(id)
        .populate({
            path:'author',
            populate:[
                {
                    path: 'notifications',
                    populate: [{path: 'author'},{ path: 'clap' } ,{ path: 'comment' }], 
                },
            ],
        })
        .populate('claps')
        .populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: [{path: 'author'}, {path: 'clap'}, {path: 'comments'}] 
        });
    return post;
    },
};

const Mutation = {
    /**
     * Creates a new post 
     * 
     * @param {string} title 
     * @param {string} description 
     * @param {string} authorId 
     */
    createPost: async (root, { input: {title, description,authorId} }, { Post, User }) => {
        if (!title){
            throw new Error("Can't Start a Dicussion without  title ");
        }
        if (!description){
            throw new Error("Can't Start a Discussion without Description ");
        }

        const newPost = await new Post({
            title,
            description,
            author: authorId,
        }).save();

        await User.findOneAndUpdate({ _id:authorId }, { $push:  { posts: newPost.id } });
        return newPost;
    },

    /**
     * Deletes a user post
     * 
     * @param {string} id 
     */
    deletePost: async (root, { input: { id }}, { User, Post , Clap  ,Notification, Comment  } ) => {
        // Find post and remove it 
        const post = await Post.findByIdAndRemove(id);
        
        // Delete post from author ( users ) posts collection
        await User.findOneAndUpdate({ _id: post.author }, { $pull: { posts: post.id } })

        // Delete post claps from claps collection
        await Clap.find({post: post.id}).deleteMany();
        
        // Delete post claps from users collection
        post.claps.map(async (clapId) => {
            await User.where({claps: clapId}).update({ $pull: {claps: clapId} });
        }) 

        // Delete post comments from comments collection
        await Comment.find({ post: post.id  }).deleteMany();
        // Delete post comments from user collection
        post.comments.map(async (commentId) => {
            await User.where({ comments: commentId }).update({
                $pull: { comments: commentId }, 
            });
        });

        // Find user notification in users collection and remove them 
        const userNotifications=  await Notification.find({ post: post.id });

        userNotifications.map( async (notification)=> {
            await User.where({ notifications: notification.id}).update({
                $pull: { notifications: notification.id },
            });
        });
        // remove notifications from notifications collection 
        await Notification.find({ post: post.id }).deleteMany();
        
        return post;
    },
};

export default { Query, Mutation };