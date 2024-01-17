const fs = require("fs");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { connectToDb } = require("./database");
const resolvers = require('./resolvers')

const server = new ApolloServer({
  typeDefs: fs.readFileSync("schema.graphql", "utf-8"),
  resolvers,
});

const app = express();
app.use(express.static("public"));
server.applyMiddleware({ app, path: "/graphql" });

connectToDb().then(() => {
  app.listen(3000, async () => {
    console.log("App started at port 3000");
  });
});
