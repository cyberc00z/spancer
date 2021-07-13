import userResolver from "./user";
import postResolver from './post';
//import upvoteResolver from "./upvote";
//import downvoteResolver from "./downvote";
import bookmarkResolver from "./bookmark";
import clapResolver from "./clap";
import commentResolver from "./comment";
import notificationResolver from "./notification";
import message from "./message";

export default [
    userResolver,
    postResolver,
    clapResolver,
    bookmarkResolver,
    commentResolver,
    notificationResolver,
    message
]