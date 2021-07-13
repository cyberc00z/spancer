import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
import { PubSub } from 'apollo-server';
import {} from "dotenv/config"
import { IS_USER_ONLINE } from '../../constants/Subscriptions';

// Export pubSub instance for publishing events
export const pubSub = new PubSub();



/**
 * Checks if client is authenticated by checking authorization key from req headers
 *
 * @param {obj} req
 */

/*
const checkAuthorization = async(req, res) => {
  const token = req.headers["authorization"]
  if (token == null){
    console.log(res);
    return res.sendStatus(401); 
  }
  const authUser = await jwt.verify(token, process.env.SECRET);
  if (authUser){
    return authUser;
  }
  else {
    console.log('Could not authenticate the user! not error in my token thing');
  }

}*/


const checkAuthorization = (token) => {
  if (token==null) {
    console.log('Token is fucking null ');
    return;
  } 
  return new Promise(async (resolve, reject) => {
    
    const authUser = await jwt.verify(token,process.env.SECRET);
    
    //console.log(token)
    if (authUser) {
      resolve(authUser);
    } else {
      reject("Couldn't authenticate user");
    }
  });
}

/**
 * Creates an Apollo server and identifies if user is authenticated or not
 *
 * @param {obj} schema GraphQL Schema
 * @param {array} resolvers GraphQL Resolvers
 * @param {obj} models Mongoose Models
 */
export const createApolloServer = (schema, resolvers, models) => {
  return new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req, connection }) => {
      if (connection) {
        return connection.context;
      }

      let authUser;
      if (req.headers.authorization !== 'null') {
        const user = await checkAuthorization(req.headers['authorization']);
        if (user) {
          authUser = user;
        }
      }

      return Object.assign({ authUser }, models);
    },
    subscriptions: {
      onConnect: async (connectionParams, webSocket) => {
        // Check if user is authenticated
        if (connectionParams.authorization) {
          const user = await checkAuthorization(connectionParams.authorization);

          // Publish user isOnline true
          pubSub.publish(IS_USER_ONLINE, {
            isUserOnline: {
              userId: user.id,
              isOnline: true,
            },
          });

          // Add authUser to socket's context, so we have access to it, in onDisconnect method
          return {
            authUser: user,
          };
        }
      },
      onDisconnect: async (webSocket, context) => {
        // Get socket's context
        const c = await context.initPromise;
        if (c && c.authUser) {
          // Publish user isOnline false
          pubSub.publish(IS_USER_ONLINE, {
            isUserOnline: {
              userId: c.authUser.id,
              isOnline: false,
            },
          });

          // Update user isOnline to false in DB
          await models.User.findOneAndUpdate(
            { email: c.authUser.email },
            {
              isOnline: false,
            }
          );
        }
      },
    },
  });
};