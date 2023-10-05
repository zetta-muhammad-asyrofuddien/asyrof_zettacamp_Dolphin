const DataLoader = require('dataloader');
const BookModel = require('./models/BookSchema');
const AuthorModel = require('./models/AuthorSchema');

/*
Data Loader in graphQL is a utility used to optimize data fetching by batching and caching individual requests.
To solve N+1 problem, avoid fetching the same data that could have been retrieved when executing the primary query 
*/
const authorLoader = new DataLoader(async (authorIds) => {
  // DataLoader constructor takes a batch loading function as an argument.
  // This function will be called once for each batch of keys.
  // In this case, the keys are authorIds.

  // Load authors based on provided authorIds.
  //   console.log(authorIds);
  const authors = await AuthorModel.find({ _id: { $in: authorIds } });

  // create a mapping of authorId to author.
  const authorMap = {};
  authors.forEach((author) => {
    authorMap[author._id] = author;
  });

  // Map the input authorIds to their respective authors based on the mapping.
  return authorIds.map((authorId) => authorMap[authorId]);
});
const bookLoader = new DataLoader(async (bookIds) => {
  // Load books based on provided bookIds
  const books = await BookModel.find({ _id: { $in: bookIds } });
  const bookMap = {};
  books.forEach((book) => {
    bookMap[book._id] = book;
  });
  return bookIds.map((bookId) => bookMap[bookId]);
});
module.exports = { authorLoader, bookLoader };
