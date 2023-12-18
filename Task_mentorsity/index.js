const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes/users');

const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
    secret: "SHIVAM_ASATI",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

const PORT = 8080;

app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
