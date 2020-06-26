const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// });
const routeNavigator = require("./src/index");
const server = app.listen(process.env.PORT, process.env.HOST, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("You're Connected at " + host + ":" + port);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//  connection.connect(function(error) {
//     if (error) throw error
//     console.log('Database has Connected')

// })
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: "true",
    optionSuccessStatus: 200,
  })
);
// app.get('/',function (requset,response) {
//     connection.query('SELECT * FROM books', function(error,result){
//         if(error){
//             throw(error)
//         }
//         response.json(result);
//     })

// })
app.use("/", routeNavigator);
module.exports = app;
