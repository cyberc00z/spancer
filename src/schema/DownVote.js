// import {gql} from "apollo-server-express";

// /**
//  * Vote Schema
//  */

// const DownVoteSchema = gql`
//     #---------------------------
//     # Model Objects
//     #--------------------------
//     type DownVote {
//         id:  ID!
//         post: ID
//         user: ID
//     }
   
//     #-------------------------------
//     # input Object
//     #-------------------------------
//     input CreateDownVoteInput {
//         userId: ID!
//         postId: ID!
//     }
//     input DeleteDownVoteInput {
//         id: ID!
//     }

//     #---------------------------------
//     # Return Payloads
//     #---------------------------------
//     type DownVotePayload {
//         id: ID!
//         user: UserPayload
//         post: PostPayload
//     }

//     #----------------------------
//     # Mutations
//     # ---------------------------
//     extend type Mutation{
//         # Creates a vote for post
//         createDownVote(input: CreateDownVoteInput!): DownVote

//         # Deletes a post like
//         deleteDownVote(input: DeleteDownVoteInput!): DownVote   
//     }

// `;

// export default DownVoteSchema;