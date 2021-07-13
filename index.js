import dotenv from 'dotenv';
import express from "express";
import { createServer } from "http";
import cors from "cors";
import mongoose from 'mongoose';
import models from "./src/models";
import schema from "./src/schema";
import resolvers from "./src/resolvers";
import { createApolloServer } from "./src/utils/apollo-server";

dotenv.config();
// initializing api
const app = express();

// connected to the mongoDB cluster
mongoose
   .connect("mongodb+srv://adhrit:NXsF3Vd3Regnw6a@cluster0.jsest.mongodb.net/api?retryWrites=true&w=majority", {
       useCreateIndex: true,
       useNewUrlParser: true,
       useFindAndModify: false,
       useUnifiedTopology: true,
   })
   .then(() => console.log('🚀 DB connected'))
   .catch((error) => console.log(error));

// Enable CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true ,
};
app.use(cors(corsOptions));

// Create a apollo server 
const server = createApolloServer(schema, resolvers, models);
server.applyMiddleware({app , path: '/graphql'});

// Create http server and subscriptions for it
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

//Listen to HTTP and WebSocket server
const PORT = process.env.PORT
httpServer.listen({ port: PORT }, () => {
    console.log(`server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})