import {gql} from "apollo-server-express";

/**
 * BookMark Schema
 * 
 */
const BookmarkSchema = gql `
    
    #----------------------------------------------
    #  Model Objects
    #----------------------------------------------
    type Bookmark {
        id: ID!
        post: ID
        user: ID
    } 

    #----------------------------------------------
    #   Input Object
    #---------------------------------------------
    input CreateBookmarkInput{
        userId: ID!
        postId: ID!
    }
    input DeleteBookmarkInput {
        id: ID!
    }

    #-------------------------------------------
    # Return Payloads
    #-------------------------------------------
    type BookmarkPayload {
        id: ID!
        user: UserPayload
        post: PostPayload
    }

    #----------------------------------------
    # Mutations
    #-------------------------------------------
    extend type Mutation{
        # creates bookmark for post
        createBookmark(input: CreateBookmarkInput!): Bookmark

        # delete bookmark
        deleteBookmark(input: DeleteBookmarkInput!): Bookmark    
        
    }

`;
export default BookmarkSchema;