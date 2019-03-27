"use strict";

const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const staticFiles = path.join(__dirname, "public");
const config = require("./config");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);
const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});
const expressValidator = require("express-validator");
const router = require("./router/router.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(middlewareSession);
app.use(express.static(staticFiles));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressValidator());
app.use("/", router);

app.listen(3000, function (err) {
    if (err) console.log(err);
    else console.log("Escuchando puerto 3000");
});