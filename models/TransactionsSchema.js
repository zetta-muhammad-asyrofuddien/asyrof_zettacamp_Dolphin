const mongoose = require('mongoose');

const termSchema = new mongoose.Schema({
  term: {
    type: Number,
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
  TranstactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'transaction',
  },
  additionalPrice: Number,
  beforeAdd: Number,
});

const allTermsSchema = new mongoose.Schema({
  [String]: termSchema, // This allows for any string key and the value should match the termSchema
});

const purchaseschema = new mongoose.Schema({
  bookData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Reference to the Book model
  },
  buyData: {
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
  },
});

const Transtaction = mongoose.model('transaction', purchaseschema);
const Term = mongoose.model('term', termSchema);

module.exports = { Transtaction, Term };
