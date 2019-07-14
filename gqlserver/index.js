const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = `
    type Query {
        getUsers: [String]
    }
`;

const resolvers = {
  Query: {
    getUsers: () => []
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ req }) {
    return { user: null };
  }
});

const port = process.send.PORT || 8080;

server.listen(port).then(({ url }) => {
  console.log(`GraphQL server ready at ${url}`);
});
