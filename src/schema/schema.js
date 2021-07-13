import {gql} from "apollo-server-express";

import UserSchema from "./User";
import PostSchema from "./Post";
import NotificationSchema from "./Notification";
//import UpVoteSchema from "./UpVote";
//import DownVoteSchema from "./DownVote"
import BookmarkSchema from "./Bookmark";
import ClapSchema from "./Clap";
import CommentSchema from "./Comment";
import MessageSchema from "./Message";

const schema = gql`
    type Query {
       _empty: String
    }

    type Mutation {
        _empty: String
    }

    type Subscription {
        _empty: String
    }

    ${UserSchema}
    ${PostSchema}
    ${ClapSchema}
    ${BookmarkSchema}
    ${NotificationSchema}
    ${CommentSchema}
    ${MessageSchema}

`;
export default schema;