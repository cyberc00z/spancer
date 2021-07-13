import mongoose from 'mongoose'
import bcrypt from "bcryptjs"
import { withFilter } from "apollo-server";
import {generateToken} from "../utils/generate-token";
import { sendEmail } from "../utils/email";
import { pubSub } from "../utils/apollo-server";

import { IS_USER_ONLINE } from "../../constants/Subscriptions";

const AUTH_TOKEN_EXPIRY = '1y';
const RESET_PASSWORD_TOKEN_EXPIRY = 3600000;

const Query = {
     
    /**
     *  get user by ID
     * @param {Id} String  
     */
    getUser: async(root, { id },{User}) => {
        if (!id){
          throw new Error('id is not valid');
        }
        const user = await User.findOne({ _id: id })
           .populate({
             path: 'posts',
             populate:[
               {
                 path: 'author',
                 populate: [
                    {
                      path: 'notifications',
                      populate: [{path: 'author'}, {path: 'clap'}, {path: 'comment'}],
                    },
                 ],
               },
               { path: 'comments', populate: {path: 'author'} },
               {'path': 'claps'},
             ],  
             options: {sort: { createdAt: 'desc' }}, 
           })
           .populate('claps')
           .populate('bookmarks')
           .populate({
             path: 'notifications',
             populate: [{path: 'author'}, {path: 'clap' }, {path: 'comment'} ],
           });
          if (!user){
            throw new Error("User with given id does not exist");
          } 
          return user;
    },
    /**
     * get current logged in user
     */
    getAuthUser: async (root, args, { authUser, Message, User }) => {
        if (!authUser) return null;

        // if user is authenticated , update it's online field to true
        const user = await User.findOneAndUpdate({ email: authUser.email  }, { isOnline: true })
           .populate( { path: 'posts', options: { sort: { createdAt:'desc' } }  })
           .populate({path: 'bookmarks', options: { sort: { createdAt: 'desc' } }})
           .populate('claps')
           .populate({ path: 'comments', options: {sort: { createdAt: 'desc' }} })
           .populate({
               path: 'notifications',
                populate: [
                   {path: 'author'},
                   {path: 'clap', populate: {path: 'post'}},
                   {path : 'comment', populate: {path : 'post'}},
                ],
                match: { seen: false  },
            });
        
        user.newNotifications = user.notifications;
    
        // Find unseen message
        const lastUnseenMessages = await Message.aggregate([
            {
              $match: {
                receiver: mongoose.Types.ObjectId(authUser.id),
                seen: false,
              },
            },
            {
              $sort: { createdAt: -1 },
            },
            {
              $group: {
                _id: '$sender',
                doc: {
                  $first: '$$ROOT',
                },
              },
            },
            { $replaceRoot: { newRoot: '$doc' } },
            {
              $lookup: {
                from: 'users',
                localField: 'sender',
                foreignField: '_id',
                as: 'sender',
              },
            },
          ]);
    // Transform data
    const newConversations = [];
    lastUnseenMessages.map((u) => {
      const user = {
        id: u.sender[0]._id,
        username: u.sender[0].username,
        image: u.sender[0].image,
        lastMessage: u.message,
        lastMessageCreatedAt: u.createdAt,
      };

      newConversations.push(user);
    });

    // Sort Users by last created messages date
    const sortedConversations = newConversations.sort((a, b) =>
    b.lastMessageCreatedAt.toString().localeCompare(a.lastMessageCreatedAt)
  );

  // Attach new conversations to auth User
  user.newConversations = sortedConversations;

  return user;
  },
  /**
   * Gets user posts by username
   *
   * @param {string} username
   * @param {int} skip how many posts to skip
   * @param {int} limit how many posts to limit
   */
   getUserPosts: async (root, { username, skip, limit }, { User, Post }) => {
    const user = await User.findOne({ username }).select('_id');

    const query = { author: user._id };
    const count = await Post.find(query).countDocuments();
    const posts = await Post.find(query)
      .populate({
        path: 'author',
        populate: [
          {
            path: 'notifications',
            populate: [{ path: 'author' },{ path: 'clap'},{ path: 'comment' }],
          },
        ],
      })
      .populate('claps')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: 'desc' } },
        populate: { path: 'author' },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    return { posts, count };
  },
  /**
   * Verifies reset password token
   *
   * @param {string} email
   * @param {string} token
   */
   verifyResetPasswordToken: async (root, { email, token }, { User }) => {
    // Check if user exists and token is valid
    const user = await User.findOne({
      email,
      passwordResetToken: token,
      passwordResetTokenExpiry: {
        $gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRY,
      },
    });
    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }

    return { message: 'Success' };
  },
};

const Mutation = {
    /**
     * Sign In user
     * 
     * @param {string} email
     * @param {string} password
     */

    signin: async (root, { input: { email, password } }, { User }) => {
        const user = await User.findOne().or([{email: email }]);  
        if (!user){
            throw new Error('User not found.');
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword){
            throw new Error('Invalid Password');
        }
        return {
            token: generateToken(user, process.env.SECRET, AUTH_TOKEN_EXPIRY),   
        };
    },

    /**
     * Sign up user
     * 
     * @param {string} username 
     * @param {string} email 
     * @param {string} password 
     */
    signup: async (root, { input: {username, email, password}}, {User}) => {
        const user=  await User.findOne().or([{ email }]);

        if (user){
           if (user.email === email){
            throw new Error(`User with given ${email} already exists. `);
          }
        }
          // empty type validation
        if (!username || !email || !password){
            throw new Error('All fields are required');
        }

        /* Email Validation
        ------------------------------------------------------------
              Hope that will usefull in future work.
        -------------------------------------------------------------
        */
       const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(String(email).toLocaleLowerCase())){
            throw new Error('Enter a Valid email address');
        }
        /*
        const emailRegex = new RegExp('ac.in','g');
        if (emailRegex.exec(email) == null){
            throw new Error('Please Enter your University Email');  
        }*/

        if (username.length <= 3){
            throw new Error('username should have 4 characters'); 
        }

        const frontEndPages =['forget-password', 'reset-password', 'explore','posts','notifications']
        if (frontEndPages.includes(email)){
            throw new Error("Please try Valid University email");
        }

        if (password.length < 6) {
            throw new Error('Password min 6 characters.');
        }

        const newUser = await new User({
            username, 
            email, 
            password,
        }).save();

        return {
            token: generateToken(newUser, process.env.SECRET, AUTH_TOKEN_EXPIRY),
        };
        //await activateAccount(token);
    },

    /**
     * Request reset password
     * 
     * @param {string} email 
     * 
     */
    requestPasswordReset: async (root, {input : {email}}, {User}) => {
        // check if user exists
        const user = await User.findOne({ email });
        if (!user){
            throw new Error(`No such user found with email ${email}`)
        }

        // Set password reset token and it's expiry
        const token = generateToken(user, process.env.SECRET, RESET_PASSWORD_TOKEN_EXPIRY);
        const tokenExpiry = Date.now() + RESET_PASSWORD_TOKEN_EXPIRY;
        await User.findOneAndUpdate(
             { _id: user.id },
             { passwordResetToken: token, passwordResetTokenExpiry: tokenExpiry },
             { new: true }
        );

        // Email user reset link
        const resetLink = `http://localhost:4000/reset-password?email=${email}&token=${token}`;
        const mailOptions = {
            to: email,
            subject: 'Password Reset',
            html: resetLink,
        };

        await sendEmail(mailOptions);

      // Return success message
        return {
            message: `A link to reset your password has been sent to ${email}`,
        };
    },
};

const Subscription = {
    /**
     * Subscribes to user's online change event
     */
    isUserOnline: {
        subscribe: withFilter(
            () => pubSub.asyncIterator(IS_USER_ONLINE),
            (payload, variables , {authUser}) => variables.authUserId === authUser.id 
        ),
    },
};
/**
 * 
 */

export default {Query, Mutation, Subscription}