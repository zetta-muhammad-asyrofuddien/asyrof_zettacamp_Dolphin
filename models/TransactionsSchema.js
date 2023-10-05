const mongoose = require('mongoose');

const termSchema = new mongoose.Schema({
  term: {
    type: Number,
  },
  amount_term: {
    type: Number,
  },
  date_of_term: {
    type: String,
  },
  total_paid: {
    type: Number,
  },
  transaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'transaction',
  },
  additionalPrice: Number,
  beforeAdd: Number,
});

// const allTermsSchema = new mongoose.Schema({
//   [String]: termSchema, // This allows for any string key and the value should match the termSchema
// });

const purchaseschema = new mongoose.Schema({
  data_of_book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Reference to the Book model
  },
  data_of_transaction: {
    amount_of_buy: {
      type: Number,
      required: true,
    },
    amount_of_discount: {
      type: Number,
      required: true,
    },
    amount_after_discount: {
      type: Number,
      required: true,
    },
    amount_of_tax: {
      type: Number,
      required: true,
    },
    amount_after_tax: {
      type: Number,
      required: true,
    },
    additional_price: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
  },
});

const Transtaction = mongoose.model('transaction', purchaseschema);
const Term = mongoose.model('term', termSchema);

module.exports = { Transtaction, Term };
