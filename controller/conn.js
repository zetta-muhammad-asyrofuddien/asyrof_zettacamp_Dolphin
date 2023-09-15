const mongoose = require('mongoose');

// const userProfile = require('../model/userModel');

const url = 'mongodb://localhost:27017/User-Profile';
//connect mongodb with moongose
const conn = mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // userModel.create();
    // userProfile;
    // const newUser = new userProfile({
    //   name: 'John Doe',
    //   age: 30,
    //   address: {
    //     street: '123 Main St',
    //     city: 'Exampleville',
    //     state: 'CA',
    //     sa: 's',
    //     postalCode: '12345',
    //   },
    //   hobbies: ['Reading', 'Hiking', 'Cooking'],
    // });

    // // Save the new user document to the "users" collection
    // newUser
    //   .save()
    //   .then((user) => {
    //     console.log('User created:', user);
    //   })
    //   .catch((error) => {
    //     console.error('Error creating user:', error);
    //   });
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    // Change "Error" to "error" here
    console.error('Error connecting to MongoDB:', error); // Change "Error" to "error" here
  });

module.exports = conn;
