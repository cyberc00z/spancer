import {gql} from "apollo-server-express";

/**
 * user schema
 */

const UserSchema = gql`
    # --------------------------
    # model objects
    # --------------------------
    
    type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    resetToken: String
    resetTokenExpiry: String
    image: File
    imagePublicId: String
    isOnline: Boolean
    posts: [PostPayload]
    bookmarks: [Bookmark]
    claps: [Clap]
    comments: [Comment]
    notifications: [NotificationPayload]
    createdAt: String
    updatedAt: String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  } 

  type Token {
      token: String!
  }
  type SuccessMessage {
      message: String!
  }

  #------------------------------------------
  # Input Objects
  #------------------------------------------
  input SignInInput {
      email: String!
      password: String 
  }
  input SignUpInput {
      username: String!
      email: String!
      password: String!
  }
  input RequestPasswordResetInput {
      email: String!
  }
  input ResetPasswordInput {
      email: String!
      token: String!
      password: String!
  }

  input UploadUserPhotoInput {
      id: ID!
      image: Upload!
      imagePublicId: String
  }

   #--------------------------------
   # User Return Payloads
   # ------------------------------
   type UserPayload {
       id: ID!
       username: String
       email: String
       password: String
       image: String
       imagePublicId: String
       isOnline: Boolean
       posts: [PostPayload]
       claps: [Clap]
       notifications: [NotificationPayload]
       newConversations: [ConversationsPayload]
       newNotifications: [NotificationPayload]
       useenMessage: Boolean
       createdAt: String
       updatedAt: String  
   }
   type UsersPayload {
        users: [UserPayload]!
        count: String!
   }
   type IsUserOnlinePayload {
       userId: ID!
       isOnline: Boolean
   }

  #---------------------------------------------
  # Queries
  #---------------------------------------------
  extend type Query {
    #Verfies reset password token
    verifyResetPasswordToken(email: String, token: String!): SuccessMessage

    # get current user
    getAuthUser: UserPayload

    # get user by username or by id
    getUser(id: String): UserPayload

    # get all users
    getUsers(userId: String!, skip: Int, limit: Int): UserPayload
  }

  #--------------------------------------------
  # Mutations
  #--------------------------------------------
  extend type Mutation {
      #signIn user
      signin(input: SignInInput!): Token

      # signup user
      signup(input: SignUpInput!): Token

      # request reset password
      requestPasswordReset(input: RequestPasswordResetInput!): SuccessMessage

      # Resets user password
      resetPassword(input: ResetPasswordInput!): Token 

  }

  #------------------------------------
  #- Subscriptions
  #------------------------------------
  extend type Subscription {
      # Subscribes to its user online event
      isUserOnline(authUserId: ID!, userId: ID!): IsUserOnlinePayload
  }

`;
export default UserSchema;