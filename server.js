"use strict";

const { default: axios } = require("axios");
const express = require("express");

const app = express();
app.use(express.json()); // it's an express thing i have to write so i can see the body of post request otherwise i will get undefined

const data = require("./Movie Data/data.json");

const dotenv = require("dotenv");
const pg = require("pg");

dotenv.config(); // if i want to read anything inside .end has to be after the config
const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;
// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

const DATABASE_URL = process.env.DATABASE_URL;
// const client = new pg.Client(DATABASE_URL); // this will connect the database with the app

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// data transfer object
function Movie(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

app.get("/", (req, res) => {
  // res.status(200).send(data); // this gives me plain text so i need to format the data
  //i will use constructor to format the data again
  // let movie = new Movie(data.title, data.poster_path, data.overview);
  //    return res.status(200).json(movie);
  return res.status(200).send("hello");
});

app.get("/Favorite", (req, res) => {
  res.status(200).send("Welcome to Favorite Page");
});

function Movietask12(id, title, release_date, poster_path, overview) {
  // created a constructor to specify the data i need

  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}

app.get("/trending", (get, res) => {
  axios
    .get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}`)
    .then((value) => {
      // console.log(value.data.results[0]); // value (which the promise) will return a huge objet, the response returns an object i only care about .data object
      let moviesList = value.data.results.map((ele) => {
        let oneMovie = new Movietask12(
          ele.id,
          ele.title,
          ele.release_date,
          ele.poster_path,
          ele.overview
        );
        return oneMovie;
      });

      res.status(200).json(moviesList);
    });
});

app.get("/searchMovie", (req, res) => {
  let searchQuery = req.query.search;

  let moviesArr = [];

  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${searchQuery}`
    )
    .then((value) => {
      // console.log(value.data);
      value.data.results.forEach((movie) => {
        moviesArr.push(movie);
      });
      return res.status(200).json(moviesArr);
    });
});

// end point to insert data to database, i need to use post because im sending data

app.post("/addMovie", (req, res) => {
  let movie = req.body; // req.body to get the data
  // write query to insert this in my db
  const sql = `INSERT INTO moviesAdded (Adult ,overview ,title, release_date, poster_path, comment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
  // `(${movie.Adult} ,${movie.overview} ,${movie.title}, ${movie.release_date}, ${movie.poster_path}, ${movie.comment})` not secured
  let values = [
    movie.Adult,
    movie.overview,
    movie.title,
    movie.release_date,
    movie.poster_path,
    movie.comment,
  ];

  client.query(sql, values).then((data) => {
    // this "data" is RETURNING
    return res.status(201).json(data.rows[0]); // 201 when u create a new instance in db the response has to be 201
  }); // to merge them and i need to use .then because this returns a promise
});

// end point to get data from database so the user see the data they intered
// i wanna get all the movies the user added

app.get("/getMovies", (req, res) => {
  const sql = `SELECT * FROM moviesAdded ;`;
  client.query(sql).then((data) => {
    return res.status(200).json(data.rows);
  });
});

app.put("/UPDATE/:id", (req, res) => {
  const id = req.params.id;
  const movie = req.body; // get the new data from the body
  console.log(movie);
  console.log(id);
  const sql = `UPDATE moviesAdded SET Adult=$1, overview=$2, title=$3, release_date=$4, poster_path=$5, comment=$6 WHERE id=${id} RETURNING *;`; // i need to update all data

  let values = [
    movie.Adult,
    movie.overview,
    movie.title,
    movie.release_date,
    movie.poster_path,
    movie.comment,
  ];

  client
    .query(sql, values)
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
});

// get addedmovie with a speecific endpoint
app.get("/getMovie/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const sql = `SELECT * FROM moviesAdded WHERE id=${id};`;

  client.query(sql).then((data) => {
    res.status(200).json(data.rows);
  });
});

app.delete("/DELETE/:id", (req, res) => {
  const id = req.params.id;

  const sql = `DELETE FROM moviesAdded WHERE id=${id};`;
  client
    .query(sql)
    .then(() => {
      return res.status(204).json([]);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
});

// client.connect() returns a promise but i dont want to connect to the server without my database first so i use.then
client.connect().then(() => {
  app.listen(PORT || 3200, () => console.log("server started on 3200"));
});
