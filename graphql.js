const { gql } = require('apollo-server-express');
const AuthorModel = require('./models/AuthorSchema');
const BookModel = require('./models/BookSchema');
const BookshelfModel = require('./models/BookShelfSchema');

/* 
typeDefs is the part of the GraphQL schema that defines the types of data that can be requested and retrieved through the GraphQL API.
structure of operations that can be executed such as Query, Mutation, and Subscription.
*/
const typeDefs = gql`
  type Author {
    _id: ID!
    name: String!
    nation: String!
  }
  type Book {
    _id: ID!
    title: String!
    genre: String!
    author: Author
    price: Float
    stock: Int
    isAvalaible: Boolean
  }
  type BookShelf {
    _id: ID!
    genres: [String!]
    books: [Book!]!
  }
  input AuthorInput {
    name: String!
    nation: String!
  }
  # In GraphQL, type Query is one of the special types used to define operations used to read or retrieve data from the GraphQL API.
  # type Query is the main type that defines the starting point for data retrieval operations.
  type Query {
    authorbyID(_id: ID!): Author
    authors: [Author]
    bookbyID(_id: ID!): Book
    books: [Book]
    bookshelf: [BookShelf]
    bookshelfbyID(_id: ID!): [BookShelf]
  }
  type Mutation {
    createAuthor(authorInput: AuthorInput): Author
    updateAuthor(_id: ID!, authorInput: AuthorInput): Author
    deleteAuthor(_id: ID!): Author
  }
`;
/*
resolvers are functions that implement GraphQL operations defined in typeDefs. 
Each resolver handles requests for specific fields or data types in the schema and returns the Retrieved results.
*/
const resolvers = {
  Query: {
    authorbyID: async (parent, { _id }) => {
      try {
        const author = await AuthorModel.findById(_id);
        return author;
      } catch (error) {
        throw new Error('Error fetching author: ' + error.message);
      }
    },
    authors: async () => {
      try {
        const author = await AuthorModel.find();
        return author;
      } catch (error) {
        throw new Error('Error fetching author: ' + error.message);
      }
    },
    bookbyID: async (parent, { _id }) => {
      try {
        const book = await BookModel.findById(_id);
        return book;
      } catch (error) {
        throw new Error('Error fetching book: ' + error.message);
      }
    },
    books: async () => {
      try {
        const book = await BookModel.find();
        return book;
      } catch (error) {
        throw new Error('Error fetching book: ' + error.message);
      }
    },
    bookshelf: async (parent) => {
      try {
        const bookshelf = await BookshelfModel.find();
        return bookshelf;
      } catch (error) {
        throw new Error('Error fetching bookshelf: ' + error.message);
      }
    },
    bookshelfbyID: async (parent, _id) => {
      try {
        const bookshelf = await BookshelfModel.find(_id);

        return bookshelf;
      } catch (error) {
        throw new Error('Error fetching bookshelf: ' + error.message);
      }
    },
  },
  Mutation: {
    createAuthor: async (parent, { authorInput }) => {
      try {
        const author = await AuthorModel.create(authorInput);
        return author;
      } catch (error) {
        throw new Error('Error creating author: ' + error.message);
      }
    },
    updateAuthor: async (parent, { _id, authorInput }) => {
      try {
        const updatedAuthor = await AuthorModel.findByIdAndUpdate(_id, authorInput, { new: true });
        return updatedAuthor;
      } catch (error) {
        throw new Error('Error updating author: ' + error.message);
      }
    },
    deleteAuthor: async (parent, { _id }) => {
      try {
        const deletedAuthor = await AuthorModel.findByIdAndDelete(_id);
        return deletedAuthor;
      } catch (error) {
        throw new Error('Error deleting author: ' + error.message);
      }
    },
  },
  /*
  This resolver ensures that when a GraphQL query requests the author field for a book,
  the server fetches and returns the corresponding author's information.
  */
  Book: {
    async author(bookData) {
      try {
        const author = await AuthorModel.findById(bookData.author); //to populate author in books
        return author;
      } catch (error) {
        throw new Error(`Error fetching author: ${error.message}`);
      }
    },
  },
  BookShelf: {
    async books(a) {
      try {
        const book = await BookModel.find({ _id: { $in: a.books } }); //to populate books in bookshelf
        return book;
      } catch (error) {
        throw new Error(`Error fetching book: ${error.message}`);
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
