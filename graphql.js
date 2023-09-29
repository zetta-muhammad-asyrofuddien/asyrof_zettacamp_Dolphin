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
  type BookPagination {
    BookTotal: Int
    DataperPage: Int
    page: String
    books: [Book]
  }
  type BookShelf {
    _id: ID!
    genres: [String!]
    books: [Book!]!
  }
  # type is used to define data types in the GraphQL schema.
  # This type is used to define the structure of objects that will be returned as a result of GraphQL operations.
  # input is used to define the structure of data that can be used as arguments for GraphQL operations.
  # This type is useful when you want to send data to the server via GraphQL operations, such as in mutation operations.
  input AuthorInput {
    name: String!
    nation: String!
  }
  input AuthorUpdate {
    name: String
    nation: String
  }
  input BookInput {
    title: String!
    genre: String!
    author: String!
    price: Float!
    stock: Int!
    isAvalaible: Boolean
  }
  input BookUpdate {
    title: String
    genre: String
    author: String
    price: Float
    stock: Int
    isAvalaible: Boolean
  }
  input BookInputMulti {
    books: [BookInput]
  }

  input BookshelfInput {
    genres: [String]
    books: [String]
  }
  # In GraphQL, type Query is one of the special types used to define operations used to read or retrieve data from the GraphQL API.
  # type Query is the main type that defines the starting point for data retrieval operations.
  type Query {
    getauthorbyID(_id: ID!): Author
    getauthors: [Author]
    getbookbyID(_id: ID!): Book
    getbooks: [Book]
    getbooksPagination(page: Int, limit: Int): BookPagination
    getbookshelf: [BookShelf]
    getbookshelfbyID(_id: ID!): [BookShelf]
  }
  # The type Query is a special type in GraphQL that defines the operations that can be executed to read or retrieve data from the GraphQL API.
  type Mutation {
    createAuthor(authorInput: AuthorInput): Author #(argument)
    updateAuthor(_id: ID!, authorInput: AuthorUpdate): Author
    deleteAuthor(_id: ID!): Author
    createBook(bookInput: BookInput): Book
    bookInputMulti(bookInputMulti: BookInputMulti): [Book]
    updateBook(_id: ID!, bookInput: BookUpdate): Book
    deleteBook(_id: ID!): Book
    createBookShelfByGenre(genre: String): BookShelf
    createBookShelf: BookShelf
    updateBookShelfRmv(idBookshelf: ID!, idRemove: ID!): BookShelf
    updateBookShelfAdd(idBookshelf: ID!, idAdd: ID!): BookShelf
    deleteBookShelf(_id: ID!): BookShelf
  }
  # The type Mutation is another special type in GraphQL that defines operations to modify or manipulate data on the server.
`;
/*
resolvers are functions that implement GraphQL operations defined in typeDefs. 
Each resolver handles requests for specific fields or data types in the schema and returns the Retrieved results.
*/
const resolvers = {
  Query: {
    getauthorbyID: async (_, { _id }) => {
      try {
        // console.log(_id);
        const author = await AuthorModel.findById(_id);
        return author;
      } catch (error) {
        throw new Error('Error fetching author: ' + error.message);
      }
    },
    getauthors: async () => {
      try {
        const author = await AuthorModel.find();
        return author;
      } catch (error) {
        throw new Error('Error fetching author: ' + error.message);
      }
    },
    getbookbyID: async (_, { _id }) => {
      try {
        const book = await BookModel.findById(_id);
        return book;
      } catch (error) {
        throw new Error('Error fetching book: ' + error.message);
      }
    },
    getbooks: async () => {
      try {
        const book = await BookModel.find();
        return book;
      } catch (error) {
        throw new Error('Error fetching book: ' + error.message);
      }
    },
    getbooksPagination: async (_, { page, limit }) => {
      try {
        const book = await BookModel.aggregate([
          {
            $sort: { title: 1 },
          },
          { $skip: page * limit },
          { $limit: limit },
          {
            $lookup: {
              from: 'authors',
              localField: 'author',
              foreignField: '_id',
              as: 'author',
            },
          },
        ]);
        const get = await BookModel.find();

        const totalItem = get.length;
        const pageTotal = Math.floor(totalItem / limit);

        const result = {
          BookTotal: totalItem,
          DataperPage: limit,
          page: `${page} / ${pageTotal}`,
          books: book,
        };

        return result;
      } catch (error) {
        throw new Error('Error fetching book: ' + error.message);
      }
    },
    getbookshelf: async (_) => {
      try {
        const bookshelf = await BookshelfModel.find();
        return bookshelf;
      } catch (error) {
        throw new Error('Error fetching bookshelf: ' + error.message);
      }
    },
    getbookshelfbyID: async (parent, _id) => {
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
    createBook: async (parent, { bookInput }) => {
      try {
        const book = await BookModel.create(bookInput);
        return book;
      } catch (error) {
        throw new Error('Error creating book: ' + error.message);
      }
    },
    bookInputMulti: async (parent, { bookInputMulti }) => {
      try {
        const book = await BookModel.create(bookInputMulti.books);
        return book;
      } catch (error) {
        throw new Error('Error creating book: ' + error.message);
      }
    },
    updateBook: async (parent, { _id, bookInput }) => {
      try {
        const book = await BookModel.findByIdAndUpdate(_id, bookInput, { new: true });
        return book;
      } catch (error) {
        throw new Error('Error Updating book: ' + error.message);
      }
    },
    deleteBook: async (parent, { _id }) => {
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
        throw new Error('Error creating bookshelf: ' + error.message);
      }
    },
    createBookShelfByGenre: async (_, genre) => {
      try {
        const books = await BookModel.find(genre).select('_id');

        //get distinct data from book's genre
        const distinctBook = await BookModel.find(genre).distinct('genre');

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
        throw new Error('Error creating bookshelf: ' + error.message);
      }
    },
    updateBookShelfRmv: async (_, { idBookshelf, idRemove }) => {
      try {
        // const valbook = await BookshelfModel.find({ books: { $in: idRemove } }); //check the book with id from body request is exist in the array
        book = await BookshelfModel.findByIdAndUpdate({ _id: idBookshelf }, { $pull: { books: idRemove } }, { new: true });
        return book;
      } catch (error) {
        throw new Error('Error Updating bookshelf: ' + error.message);
      }
    },
    updateBookShelfAdd: async (_, { idBookshelf, idAdd }) => {
      try {
        book = await BookshelfModel.findByIdAndUpdate({ _id: idBookshelf }, { $push: { books: idAdd } }, { new: true });
        return book;
      } catch (error) {
        throw new Error('Error Updating bookshelf: ' + error.message);
      }
    },
    deleteBookShelf: async (_, { _id }) => {
      try {
        const bookshelf = await BookshelfModel.findByIdAndDelete(_id);
        return bookshelf;
      } catch (error) {
        throw new Error('Error Deleting bookshelf: ' + error.message);
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
    async books(parent) {
      try {
        const book = await BookModel.find({ _id: { $in: parent.books } }); //to populate books in bookshelf
        return book;
      } catch (error) {
        throw new Error(`Error fetching book: ${error.message}`);
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
