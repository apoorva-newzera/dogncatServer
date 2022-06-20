const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();
app.use(express.json({ limit: "50mb" }));

const data = {
  heading: "Heading Text",
  subheading:
    "Subheading Lorem Ipsum has been the industry's standard dummy text eversince the 1500s, when an unknown printer took a galley of typeand scrambled it to make a type specimen book.",
};

const contact = {
  name: "",
  email: "",
  message: "",
};

// Schema
const typeDefs = gql`
  type Data {
    heading: String!
    subheading: String!
  }

  type Contact {
    name: String!
    email: String!
    message: String!
  }

  type Query {
    getData: Data
    getContact: Contact
  }

  type Mutation {
    sendMessage(name: String!, email: String!, message: String!): Contact
  }
`;

//Resolvers
const resolvers = {
  Query: {
    getData: () => data,
    getContact: () => contact,
  },
  Mutation: {
    sendMessage: (parent, args) => {
      console.log(
        `Contact Rxed = name : ${args.name}, email : ${args.email}, message : ${args.message}`
      );
      contact.name = args.name;
      contact.email = args.email;
      contact.message = args.message;
      return contact;
    },
  },
};

let server = null;
async function startServer() {
  server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
  });
  await server.start();
  server.applyMiddleware({ app });
}
startServer();

const PORT = 5000;
app.listen({ port: PORT }, () => {
  console.log(`Server ready at localhost:${PORT}${server.graphqlPath}`);
});
