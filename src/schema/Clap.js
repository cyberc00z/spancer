import {gql} from "apollo-server-express";

/**
 * Vote Schema
 */

const ClapSchema = gql`
    #---------------------------
    # Model Objects
    #--------------------------
    type Clap {
        id:  ID!
        post: ID
        user: ID
    }
   
    #-------------------------------
    # input Object
    #-------------------------------
    input CreateClapInput {
        userId: ID!
        postId: ID!
    }
    input DeleteClapInput {
        id: ID!
    }

    #---------------------------------
    # Return Payloads
    #---------------------------------
    type ClapPayload {
        id: ID!
        user: UserPayload
        post: PostPayload
    }

    #----------------------------
    # Mutations
    # ---------------------------
    extend type Mutation{
        # Creates a clap for post
        createClap(input: CreateClapInput!): Clap

        # Deletes a clap 
        removeClap(input: DeleteClapInput!): Clap   
    }

`;

export default ClapSchema;