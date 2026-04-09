
const { ApolloServer } = require("apollo-server");
const { typeDefs, resolvers } = require("./schema");

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen(4000).then(({ url }) => {
  console.log("Server running at " + url);
});
