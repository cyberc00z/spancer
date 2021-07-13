import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema;

/**
 * User Schema that  has link to Vote, Post, Comment, Notifications
 */
const userSchema = new Schema(
    {
        username: {
           type: String,
           required: true,
           unique: false
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true, 
        },
        passwordResetToken: String,
        passwordResetTokenExpiry: Date,
        password: {
            type: String,
            required: true,
        },
        image: String,
        imagePublicId: String,
        isOnline: {
            type: Boolean,
            default: false,
        },
        posts: [
            {
              type: Schema.Types.ObjectId,
              ref: 'Post'
            },
        ],
        claps: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Clap'
            }
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        notifications: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Notification',
            },
        ],
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ] ,
        bookmarks: [ 
            {
                type: Schema.Types.ObjectId,
                ref : 'Bookmark'
            }
        ] 
    },
    {
        timestamps: true,
    }
);

/**Hashes the users password while saving it to Database */
userSchema.pre('save', function(next){
    if (!this.isModified('password')){
        return next();
    }

    bcrypt.genSalt(10, (e, salt) => {
        if (e) return next(e);

        bcrypt.hash(this.password, salt, (e, hash) => {
            if (e) return next(e);

            this.password = hash;
            next();
        });
    });
});

export default mongoose.model('User', userSchema);
