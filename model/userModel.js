const mongoose = require('mongoose');

// Define the profile schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  // Embed the complete address schema
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
  },
  // Define hobbies as an array of strings
  hobbies: [String],
});

const userProfile = mongoose.model('Profile', userSchema);

module.exports = userProfile;
