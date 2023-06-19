// set up ======================================================================
var http = require("http");
var express = require("express");
var app = express(); // create our app w/ express
var mongoose = require("mongoose"); // mongoose for mongodb
var cors = require("cors");

var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var path = require("path");

var port = 4000;

// configuration ===============================================================
const uri =
  "mongodb+srv://julia:julia123@cluster0.pif3f.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true
}); // connect to mongoDB database on modulus.iox

app.set("port", process.env.PORT || port);
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // set the static files location /public/img will be /img for users

// define model ================================================================
var Todo = mongoose.model("Todo", {
  text: String,
  done: Boolean
});

// routes ======================================================================
app.use(cors());

// api ---------------------------------------------------------------------
// get all todos
app.get("/api/todos", function (req, res) {
  // use mongoose to get all todos in the database
  Todo.find(function (err, todos) {
    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) res.send(err);

    res.json(todos); // return all todos in JSON format
  });
});

app.get("/api/todos/:todo_id", function (req, res) {
  // use mongoose to get all todos in the database
  Todo.find(
    {
      _id: req.params.todo_id
    },
    function (err, todos) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);

      res.json(todos); // return all todos in JSON format
    }
  );
});

// create todo and send back all todos after creation
app.post("/api/todos", function (req, res) {
  console.log("post new todo:", req.body);
  // create a todo, information comes from AJAX request from Angular
  Todo.create(
    {
      text: req.body.text,
      done: false
    },
    function (err, todo) {
      if (err) res.send(err);

      // get and return all the todos after you create another
      Todo.find(function (err, todos) {
        if (err) res.send(err);
        res.json(todos);
        console.log("res: ", res);
      });
    }
  );
});

// mark todo as done
app.post("/api/todos/done/:todo_id", async function (req, res) {
  console.log("mark todo as done - request body: ", req.body);

  await Todo.findOneAndUpdate(
    { _id: req.params.todo_id },
    { done: req.body.done }
  ).catch(err => console.log("error: ", err));

  // get and return all the todos after you update
  Todo.find(function (err, todos) {
    if (err) res.send(err);
    res.json(todos);
  });
});

// app.put("/api/todos", function (req, res) {});
app.patch("/api/todos", function (req, res) {});

// delete a todo
app.delete("/api/todos/:todo_id", function (req, res) {
  Todo.remove(
    {
      _id: req.params.todo_id
    },
    function (err, todo) {
      if (err) res.send(err);

      // get and return all the todos after you create another
      Todo.find(function (err, todos) {
        if (err) res.send(err);
        res.json(todos);
      });
    }
  );
});

// application -------------------------------------------------------------
app.get("*", function (req, res) {
  res.sendFile("./public/index.html", { root: __dirname });
});

// listen (start app with node server.js) ======================================
var server = http.createServer(app);
server.listen(port, function () {
  console.log("Express server listening on: http://localhost:" + port);
});
// server.listen(app.get("port"), function () {
//   console.log(
//     "Express server listening on: http://localhost:" + app.get("port")
//   );
// });
