'use strict';

const { default: axios } = require("axios");
const express = require("express");

const app = express();

const data = require("./Movie Data/data.json")

const dotenv = require('dotenv');
dotenv.config();
const APIKEY = process.env.APIKEY;


// data transfer object 
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.get('/', (req, res) => {

    // res.status(200).send(data); // this gives me plain text so i need to format the data
    //i will use constructor to format the data again
    let movie = new Movie(data.title, data.poster_path, data.overview);
    res.status(200).json(movie);

    // console.log(movie);
});


// app.get('/Favorite', (req, res) => {

//     res.status(200).send("Welcome to Favorite Page");

// });

function Movietask12(id, title, release_date, poster_path, overview) { // created a constructor to specify the data i need 

    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.get('/trending', (get, res) => {

    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}`).then(value => {
        // console.log(value.data.results[0]); // value (which the promise) will return a huge objet, the response returns an object i only care about .data object
        let oneMovie = new Movietask12(value.data.results[0].id, value.data.results[0].title, value.data.results[0].release_date, value.data.results[0].poster_path, value.data.results[0].overview);
        console.log(oneMovie);

        res.status(200).json(oneMovie);
    })

})

app.get('/searchMovie', (req, res) => {

    let searchQuery = req.query.search;

    let moviesArr = [];

    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${searchQuery}`).then(value => {

        // console.log(value.data);
        value.data.results.forEach(movie => {
            moviesArr.push(movie);
        })
        return res.status(200).json(moviesArr);
    })

})



app.listen(3100, () => console.log("server started on 3000"));