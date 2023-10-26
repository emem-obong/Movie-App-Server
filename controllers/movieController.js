const Movie = require("../models/movie");

const allData = async (req, res) => {
  // get all movies from db  and send it to json response

  const movies = await Movie.find({});

  res.status(200).json({
    data: movies,
  });
};

const allSeries = async (req, res) => {
  const series = await Movie.find({ type: "series" });

  res.status(200).json({
    data: series,
  });
};
const allMovies = async (req, res) => {
  const movies = await Movie.find({ type: "movie" });

  res.status(200).json({
    data: movies,
  });
};
module.exports = { allData, allMovies, allSeries };
