'use strict';

const express = require("express");

const app = express();

const data = require("./Movie Data/data.json")


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

    console.log(movie);
});


app.get('/Favorite', (req, res) => {

    res.status(200).send("Welcome to Favorite Page");

});

app.listen(3000, () => console.log("server started on 3000"));