const { gql } = require('apollo-server-express');
const AuthorModel = require('./models/AuthorSchema');
const BookModel = require('./models/BookSchema');
const mongoose = require('mongoose');

const BookshelfModel = require('./models/BookShelfSchema');
const jwt = require('jsonwebtoken');
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
    title: String
    genre: String!
    author_id: Author
    price: Float
    stock: Int
    is_avalaible: Boolean
  }
  type BookPagination {
    book_total: Int
    data_per_page: Int
    page: String
    books: [Book]
  }
  type BookShelf {
    _id: ID!
    genres: [String]
    book_id: [Book]
  }
  # add user
  type GetToken {
    token: String
  }
  # type is used to define data types in the GraphQL schema.
  # This type is used to define the structure of objects that will be returned as a result of GraphQL operations.
  # input is used to define the structure of data that can be used as arguments for GraphQL operations.
  # This type is useful when you want to send data to the server via GraphQL operations, such as in mutation operations.
  input AuthorInput {
    name: String
    nation: String
  }
  input AuthorUpdate {
    name: String
    nation: String
  }
  input BookInput {
    title: String!
    genre: String!
    author_id: String!
    price: Float!
    stock: Int!
    is_avalaible: Boolean
  }
  input BookUpdate {
    title: String
    genre: String
    author_id: String
    price: Float
    stock: Int
    is_avalaible: Boolean
  }

  input BookshelfInput {
    genres: [String]
    book_id: [String]
  }
  # In GraphQL, type Query is one of the special types used to define operations used to read or retrieve data from the GraphQL API.
  # type Query is the main type that defines the starting point for data retrieval operations.
  type Query {
    GetOneAuthorById(_id: ID!): Author
    GetAllAuthor: [Author]
    GetOneBookById(_id: ID!): Book
    GetAllBook: [Book]
    GetAllBookByGenre(genre: String): [Book]
    GetAllBookPagination(page: Int, limit: Int): BookPagination
    GetAllBookhelf: [BookShelf]
    GetOneBookhelfById(_id: ID!): [BookShelf]
  }
  # The type Query is a special type in GraphQL that defines the operations that can be executed to read or retrieve data from the GraphQL API.
  type Mutation {
    Login(username: String, password: String): GetToken
    CreateAuthor(author_input: AuthorInput): Author #(argument)
    UpdateAuthor(_id: ID!, author_input: AuthorUpdate): Author
    DeleteAuthor(_id: ID!): Author
    CreateBook(book_input: BookInput): Book
    BookInputMulti(book_input_multi: [BookInput]): [Book]
    UpdateBook(_id: ID!, book_input: BookUpdate): Book
    DeleteBook(_id: ID!): Book
    CreateBookShelfByGenre(genre: String): BookShelf
    CreateBookShelf: BookShelf
    UpdateBookShelfRemove(bookshelf_id: ID!, remove_id: ID!): BookShelf
    UpdateBookShelfAdd(bookshelf_id: ID!, add_id: ID!): BookShelf
    DeleteBookShelf(_id: ID!): BookShelf
  }
  # The type Mutation is another special type in GraphQL that defines operations to modify or manipulate data on the server.
`;
/*
resolvers are functions that implement GraphQL operations defined in typeDefs. 
Each resolver handles requests for specific fields or data types in the schema and returns the Retrieved results.
*/

function hasNonEmptyString(input) {
  return Object.values(input).some((field) => typeof field === 'string' && field.trim() !== '');
}

// function allFieldsExist(input) {
//   return Object.values(input).every((field) => field !== undefined);
// }

//auth verify
function VerifyJWT(context) {
  const token = context.req.headers.authorization;
  if (token) {
    let userpass;
    //chek the token baerer token or from header
    if (token.split(' ').length === 2) {
      //barear ladkjwahdnlawd
      userpass = token.split(' ')[1];
    } else if (token.split(' ').length === 1) {
      //ladkjwahdnlawd
      userpass = token;
    }

    jwt.verify(userpass, 'plered', (err, decoded) => {
      if (err) {
        throw new Error('Invalid Token');
      }
      console.log('Login As :' + decoded.username);
    });
  }
}

const resolvers = {
  Query: {
    GetOneAuthorById: async (_, { _id }, context) => {
      try {
        VerifyJWT(context);
        if (_id) {
          return await AuthorModel.findById(_id);
        }
      } catch (error) {
        throw new Error('Error fetching author: ' + error.message);
      }
    },
    GetAllAuthor: async (_, args, context) => {
      try {
        VerifyJWT(context);
        const author = await AuthorModel.find();
        if (author) {
          return author;
        }
      } catch (error) {
        throw new Error('Error fetching author: ' + error.message);
      }
    },
    GetOneBookById: async (_, { _id }, context) => {
      try {
        VerifyJWT(context);
        if (_id) {
          return await BookModel.findById(_id);
        }
      } catch (error) {
        throw new Error('Error fetching book: ' + error.message);
      }
    },
    GetAllBook: async (_, args, context) => {
      try {
        VerifyJWT(context);
        const book = await BookModel.find();
        if (book) {
          return book;
        }
      } catch (error) {
        throw new Error('Error fetching book: ' + error.message);
      }
    },
    GetAllBookByGenre: async (_, args, context) => {
      try {
        VerifyJWT(context);
        const book = await BookModel.find();
        if (book) {
          return book;
        }
      } catch (error) {
        throw new Error('Error fetching book: ' + error.message);
      }
    },
    GetAllBookPagination: async (_, { page, limit }, context) => {
      try {
        VerifyJWT(context);
        // page = null;
        // limit = null;
        if (page && limit) {
          if (page >= 0 && limit > 0) {
            // console.log('s');
            const book = await BookModel.aggregate([
              {
                $facet: {
                  books: [{ $sort: { title: 1 } }, { $skip: page * limit }, { $limit: limit }],
                  bookCount: [
                    {
                      $group: {
                        _id: null,
                        count: { $sum: 1 }, // Count the number of books
                      },
                    },
                  ],
                },
              },
            ]);
            if (book) {
              const Get = await BookModel.find();
              // const mapBook = new Map(...book[0].books);
              const totalItem = Get.length;
              const pageTotal = Math.floor(totalItem / limit);
              // const data = book[0].books;
              // const count = book[0].bookCount[0].count;
              // const mapData = new Map();
              // mapData.set('s', { booksdata: data, count: count });
              // console.log(mapData);
              const result = {
                BookTotal: totalItem,
                DataperPage: limit,
                page: `${page} / ${pageTotal}`,
                books: book[0].books,
              };
              // if (book) {
              //   return book;
              // }
              return result;
            }
          } else {
            throw new Error('Page should more then 1');
          }
        }
      } catch (error) {
        throw new Error('Error fetching book: ' + error.message);
      }
    },
    GetAllBookhelf: async (_, args, context) => {
      try {
        VerifyJWT(context);
        let bookshelf = await BookshelfModel.find();
        // bookshelf = null;
        // console.log(bookshelf);
        if (bookshelf) {
          return bookshelf;
        }
      } catch (error) {
        throw new Error('Error fetching bookshelf: ' + error.message);
      }
    },
    GetOneBookhelfById: async (parent, _id, context) => {
      try {
        VerifyJWT(context);

        if (_id) {
          return await BookshelfModel.find(_id);
        }
      } catch (error) {
        throw new Error('Error fetching bookshelf: ' + error.message);
      }
    },
  },
  Mutation: {
    Login: async (_, user) => {
      try {
        const jwtSecretKey = 'plered'; // Secret key
        const data = {
          username: 'Asyrofuddien',
          password: 'atopsehat',
        }; // Predefined user data
        // user.username = '';
        // Sanity check to ensure username and password are provided and non-empty strings
        if (user) {
          if (
            (user.username || user.password || typeof user.username === 'string' || typeof user.password === 'string') &&
            data.username === user.username &&
            data.password === user.password
          ) {
            const token = jwt.sign({ username: user.username }, jwtSecretKey, { expiresIn: '6h' });
            return { token };
          } else {
            return {
              token: 'Token not generate',
            };
          }
        }
      } catch (error) {
        throw new Error('Internal Server Error');
      }
    },
    CreateAuthor: async (parent, { author_input }, context) => {
      try {
        // const i = 2;
        VerifyJWT(context);
        if (author_input) {
          if (author_input.name && author_input.nation) {
            if (author_input.nation.trim().length && author_input.name.trim().length) {
              return await AuthorModel.create(author_input);
            }
          }
        }
      } catch (error) {
        throw new Error('Error creating author: ' + error.message);
      }
    },
    UpdateAuthor: async (parent, { _id, author_input }, context) => {
      try {
        VerifyJWT(context);
        // console.log(_id, author_input);

        if (_id && author_input && hasNonEmptyString(author_input)) {
          return await AuthorModel.findByIdAndUpdate(_id, author_input, { new: true });
        }
      } catch (error) {
        throw new Error('Error updating author: ' + error.message);
      }
    },
    DeleteAuthor: async (parent, { _id }, context) => {
      try {
        VerifyJWT(context);
        // _id = null;
        if (_id) {
          return await AuthorModel.findByIdAndDelete(_id);
        }
      } catch (error) {
        throw new Error('Error deleting author: ' + error.message);
      }
    },
    CreateBook: async (parent, { book_input }, context) => {
      try {
        VerifyJWT(context);
        // book_input = null;
        const { title, genre, author_id, price, stock, is_avalaible } = book_input;
        if (title && genre && author_id && price && stock && is_avalaible) {
          return await BookModel.create(book_input);
        }
      } catch (error) {
        throw new Error('Error creating book: ' + error.message);
      }
    },
    BookInputMulti: async (parent, { book_input_multi }, context) => {
      try {
        VerifyJWT(context);
        // console.log(book_input_multi);
        // Check if book_input_multi is an array and is not empty
        if (Array.isArray(book_input_multi) && book_input_multi.length >= 0) {
          return await BookModel.create(book_input_multi);
        }
      } catch (error) {
        throw new Error('Error creating book: ' + error.message);
      }
    },
    UpdateBook: async (parent, { _id, book_input }, context) => {
      try {
        VerifyJWT(context);
        if (_id && book_input && hasNonEmptyString(book_input)) {
          return BookModel.findByIdAndUpdate(_id, book_input, { new: true });
        }
      } catch (error) {
        throw new Error('Error Updating book: ' + error.message);
      }
    },
    DeleteBook: async (parent, { _id }, context) => {
      try {
        VerifyJWT(context);
        if (_id) {
          return await BookModel.findByIdAndDelete(_id);
        }
      } catch (error) {
        throw new Error('Error Deleting book: ' + error.message);
      }
    },
    CreateBookShelf: async (parent, agrs, context) => {
      try {
        VerifyJWT(context);
        let books = await BookModel.find().select('_id');
        // books = null;
        if (!books) {
          throw new Error('Book not found');
        }
        //Get distinct data from book's genre
        const distinctBook = await BookModel.distinct('genre');
        if (!distinctBook) {
          throw new Error('Genre not found');
        }
        // Extract book IDs for each group
        const bookId = books.map((book) => book._id);
        if (!bookId) {
          throw new Error('Book ids not found');
        }
        // create the two bookshelves
        const bookshelf = await BookshelfModel.create({ genres: distinctBook, book_id: bookId }); //create bookshelf
        if (!bookshelf) {
          throw new Error('Book ids not found');
        }
        // console.log(arrBook);

        return bookshelf;
      } catch (error) {
        throw new Error('Error creating bookshelf: ' + error.message);
      }
    },
    CreateBookShelfByGenre: async (_, { genre }, context) => {
      try {
        VerifyJWT(context);
        // console.log(genre);
        if (!genre) {
          throw new Error('Genre must not empty');
        }
        let books = await BookModel.find(genre).select('_id');
        // books = null;
        if (!books) {
          throw new Error('Book not found');
        }
        //Get distinct data from book's genre
        const distinctBook = await BookModel.find(genre).distinct('genre');
        if (!distinctBook) {
          throw new Error('Genre not found');
        }
        // Extract book IDs for each group
        const bookId = books.map((book) => book._id);
        if (!bookId) {
          throw new Error('Book ids not found');
        }
        // create the two bookshelves
        const bookshelf = await BookshelfModel.create({ genres: distinctBook, book_id: bookId }); //create bookshelf
        if (!bookshelf) {
          throw new Error('Book ids not found');
        }
        // console.log(arrBook);

        return bookshelf;
      } catch (error) {
        throw new Error('Error creating bookshelf: ' + error.message);
      }
    },
    UpdateBookShelfRemove: async (_, { bookshelf_id, remove_id }, context) => {
      try {
        VerifyJWT(context);
        // const valbook = await BookshelfModel.find({ books: { $in: remove_id } }); //check the book with id from body request is exist in the array
        if (!bookshelf_id || !remove_id) {
          throw new Error('Both bookshelf_id and remove_id must be provided');
        }

        // Check if bookshelf_id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(bookshelf_id)) {
          throw new Error('Invalid bookshelf_id. Must be a valid ObjectId');
        }

        // Check if remove_id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(remove_id)) {
          throw new Error('Invalid remove_id. Must be a valid ObjectId');
        }
        return await BookshelfModel.findByIdAndUpdate({ _id: bookshelf_id }, { $pull: { book_id: remove_id } }, { new: true });
      } catch (error) {
        throw new Error('Error Updating bookshelf: ' + error.message);
      }
    },
    UpdateBookShelfAdd: async (_, { bookshelf_id, add_id }, context) => {
      try {
        VerifyJWT(context);
        // Check if both bookshelf_id and remove_id are provided
        // bookshelf_id = null;
        // bookshelf_id = 's';
        if (!bookshelf_id || !add_id) {
          throw new Error('Both bookshelf_id and remove_id must be provided');
        }

        // Check if bookshelf_id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(bookshelf_id) || !mongoose.Types.ObjectId.isValid(add_id)) {
          throw new Error('Invalid id. Must be a valid ObjectId');
        }

        return await BookshelfModel.findByIdAndUpdate({ _id: bookshelf_id }, { $push: { book_id: add_id } }, { new: true });
      } catch (error) {
        throw new Error('Error Updating bookshelf: ' + error.message);
      }
    },
    DeleteBookShelf: async (_, { _id }, context) => {
      try {
        VerifyJWT(context);
        if (_id) {
          return await BookshelfModel.findByIdAndDelete(_id);
        }
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
    async author_id(parent, args, context) {
      try {
        // console.log(parent.author);
        return await context.authorLoader.load(parent.author_id); //load single data
      } catch (error) {
        throw new Error(`Error fetching author: ${error.message}`);
      }
    },
  },
  BookShelf: {
    async book_id(parent, args, context) {
      try {
        // console.log(parent.books);
        if (parent.book_id) {
          return await context.bookLoader.loadMany(parent.book_id); //load field array of ObjectId
        }
      } catch (error) {
        throw new Error(`Error fetching books: ${error.message}`);
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
