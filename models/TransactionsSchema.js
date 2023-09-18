const mongoose = require('mongoose');
const Book = require('./BookSchema');
const termSchema = new mongoose.Schema({
  term: {
    type: Object,
    required: true,
  },
  amountTerm: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  totalPaid: {
    type: Number,
    required: true,
  },
  additionalPrice: Number,
  beforeAdd: Number,
});

const allTermsSchema = new mongoose.Schema({
  [String]: termSchema, // This allows for any string key and the value should match the termSchema
});
const buyDataSchema = new mongoose.Schema({
  amountOfBuy: {
    type: Number,
    required: true,
  },
  amountofDisc: {
    type: Number,
    required: true,
  },
  afterDisc: {
    type: Number,
    required: true,
  },
  amountofTax: {
    type: Number,
    required: true,
  },
  afterTax: {
    type: Number,
    required: true,
  },
  additionalPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const purchaseschema = new mongoose.Schema({
  bookData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Book, // Reference to the Book model
  },
  buyData: buyDataSchema,
  listTerm: [Number], // Array of numbers
  allTerms: allTermsSchema,
});

const Transtaction = mongoose.model('transaction', purchaseschema);
const Term = mongoose.model('term', termSchema);

module.exports = { Transtaction, Term };
