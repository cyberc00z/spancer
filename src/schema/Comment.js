import {gql} from "apollo-server-express";

/**
 * Comment Schema 
 */

const CommentSchema = gql `
    type Comment {
        id: ID!
        comment: String!
        author: ID
        post: ID
        claps: [Clap]
        comments: [Comment]
        createdAt: String
        updatedAt: String  
    }
    
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateCommentInput {
    comment: String!
    author: ID!
    postId: ID!
  }
  
  input DeleteCommentInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type CommentPayload {
    id: ID
    comment: String
    author: UserPayload
    post: PostPayload
    claps: [Clap]
    comments: [Comment]
    createdAt: String
    updatedAt: String
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a post comment
    createComment(input: CreateCommentInput!): Comment
    # Deletes a post comment
    deleteComment(input: DeleteCommentInput!): Comment
  }
`;

export default CommentSchema