import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Notification schema that has refrence to User, Vote and Comment and MESSAGE schema
 * 
 */
const notificationSchema = Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        post: Schema.Types.ObjectId,
        
        clap: {
            type: Schema.Types.ObjectId,
            ref: 'Clap',
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref:'Comment'
        },
        seen: {
            type: Boolean,
            default: false
        },

    },
    {
        timestamps: true
    }
); 

export default mongoose.model('Notification', notificationSchema);