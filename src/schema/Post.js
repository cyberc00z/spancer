import {gql} from "apollo-server-express";

const PostSchema = gql`
    #-------------------------------------
    #   Model Objects
    #-------------------------------------
    type Post {
        id: ID!
        title: String
        description: String
        author: User!
        claps: [Clap]
        comments: [Comment]
        createdAt: String
        updatedAt: String
    }

    #--------------------------------------
    #   Input Objects
    #-------------------------------------
    input CreatePostInput {
        title: String
        description: String
        authorId: ID!
    }
    input DeletePostInput {
        id: ID!
    }

    #-----------------------------------------------
    #    Return Payloads
    #------------------------------------------------
    type UserPostsPayload {
        posts: [PostPayload]!
        count: String!
    }

    type PostPayload {
        id:  ID!
        title: String
        description: String
        author: UserPayload!
        claps: [Clap]
        comments: [CommentPayload]
        createdAt: String
        updatedAt: String   
    }

    type PostsPayload {
        posts: [PostPayload]!
        count: String!
    }

    #-------------------------------------
    #    Queries
    #-------------------------------------
    extend type Query {
        #get user posts by username
        getUserPosts(username: String!, skip: Int, limit: Int): UserPostsPayload

        #get all posts
        getPosts(authUserId: ID!, skip: Int, limit: Int): PostsPayload
    
        # gets post by id
        getPost(id: ID!): PostPayload
    }
    
    #-------------------------------------------------
    #   Mutations
    #-------------------------------------------------
    extend type Mutation {
        # creates a new post
        createPost(input: CreatePostInput!): PostPayload

        # deletes a user post
        deletePost(input: DeletePostInput!): PostPayload
    }

`;

export default PostSchema;