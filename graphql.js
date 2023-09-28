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
  input BookInput {
    title: String!
    genre: String!
    author: String
    price: Float!
    stock: Int!
    isAvalaible: Boolean
  }
  input BookshelfInput {
    genres: [String]!
    books: [String!]!
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
    createBook(bookInput: BookInput): Book
    updateBook(_id: ID!, bookInput: BookInput): Book
    deleteBook(_id: ID!): Book
    createBookShelf: BookShelf
    updateBookShelf(idBookshelf: ID!, idRemove: ID!): BookShelf
    deleteBookShelf(_id: ID!): BookShelf
  }
`;
/*
resolvers are functions that implement GraphQL operations defined in typeDefs. 
Each resolver handles requests for specific fields or data types in the schema and returns the Retrieved results.
*/
const resolvers = {
  Query: {
    authorbyID: async (_, { _id }) => {
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
    bookbyID: async (_, { _id }) => {
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
    bookshelf: async (_) => {
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
    deleteAuthor: async (_, { _id }) => {
      try {
        const deletedAuthor = await AuthorModel.findByIdAndDelete(_id);
        return deletedAuthor;
      } catch (error) {
        throw new Error('Error deleting author: ' + error.message);
      }
    },
    createBook: async (_, { bookInput }) => {
      try {
        const book = await BookModel.create(bookInput);
        return book;
      } catch (error) {
        throw new Error('Error creating book: ' + error.message);
      }
    },
    updateBook: async (_, { _id, bookInput }) => {
      try {
        const book = await BookModel.findByIdAndUpdate(_id, bookInput, { new: true });
        return book;
      } catch (error) {
        throw new Error('Error Updating book: ' + error.message);
      }
    },
    deleteBook: async (_, { _id }) => {
      try {
        const book = await BookModel.findByIdAndDelete(_id);
        return book;
      } catch (error) {
        throw new Error('Error Deleting book: ' + error.message);
      }
    },
    createBookShelf: async () => {
      try {
        const books = await BookModel.find().select('_id');

        //get distinct data from book's genre
        const distinctBook = await BookModel.distinct('genre');

        // Extract book IDs for each group
        const bookId = books.map((book) => book._id);

        // Create the two bookshelves
        const bookshelf = await BookshelfModel.create({ genres: distinctBook, books: bookId }); //create bookshelf

        // console.log(arrBook);
        if (books.length === 0) {
          return 'Book not found';
        } else {
          return bookshelf;
        }
      } catch (error) {
        throw new Error('Error creating book: ' + error.message);
      }
    },
    updateBookShelf: async (_, { idBookshelf, idRemove }) => {
      try {
        const valbook = await BookshelfModel.find({ books: { $in: idRemove } }); //check the book with id from body request is exist in the array

        if (valbook.length !== 0) {
          //if book data exist

          if (idBookshelf) {
            //if the filter is exist

            book = await BookshelfModel.updateOne({ books: { $in: idBookshelf } }, { $pull: { books: idRemove } });
            return book;
          } else {
            return { error: 'Bad Request', msg: 'insert filter' };
          }
        } else {
          return { msg: 'BookId not found' };
        }
      } catch (error) {
        throw new Error('Error Updating book: ' + error.message);
      }
    },
  },
  /*
  This resolver ensures that when a GraphQL query requests the author field for a book,
  the server fetches and returns the corresponding author's information.
  */
  Book: {
    async author(parent) {
      try {
        const author = await AuthorModel.findById(parent.author); //to populate author in books
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
