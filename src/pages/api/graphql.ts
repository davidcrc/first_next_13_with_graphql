import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../prisma/db";

export type Context = {
  prisma: PrismaClient;
};

const typeDefs = `#graphql

  type Novel {
    id: ID!
    title: String
    image: String
    createdAt: String
    updatedAt: String
    authors: [Author]
  }

  type Author {
    id: ID!
    name: String
    novelID: String
  }

  type Query {
    novel(id: ID): Novel
    novels: [Novel]
  }

  type Mutation {
    addNovel(image: String, title: String): Novel
  }
`;

const resolvers = {
  Query: {
    novel: async (parent: any, args: any, context: Context) => {
      return await context.prisma.novel.findUnique({
        where: { id: args.id },
      });
    },
    novels: async (parent: any, args: any, context: Context) => {
      return await context.prisma.novel.findMany();
    },
  },
  Novel: {
    authors: async (parent: any, args: any, context: Context) => {
      return await context.prisma.author.findMany();
    },
  },
  Mutation: {
    addNovel: async (parent: any, args: any, context: Context) => {
      return await context.prisma.novel.create({
        data: {
          title: args.title,
          image: args.image,
        },
      });
    },
  },
};

const apolloServer = new ApolloServer<Context>({
  resolvers,
  typeDefs,
});

export default startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => ({ req, res, prisma }),
});
