require("dotenv").config();
const mongoose = require("mongoose");
const movie = require("./models/movie");
const movieJson =require("./movies.json")
const start = async () => {
  try {

    // connects to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
    console.log("Deleting.....");

    // deletes the previous movies in the database
    await movie.deleteMany();
    console.log("Previous ones deleted");
    console.log("uploading......");
    // uploads the movies from moviejson 
    await movie.create(movieJson);


    console.log("Movie Uploaded Successfully");

    // breaks the terminal when it is done
    process.exit(0);
  } catch (error) {
    console.log(error);
    console.log("unable to connect");
    process.exit(1);
  }
};

start();
