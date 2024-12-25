const express = require('express')
const path = require('path')
const cors = require("cors");
const router = require('./routers/router')
const mongoDB = require('./db/mongoDB')
require("dotenv").config();

const app = express()
const port = 3000

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

app.use("/", express.static(path.join(__dirname, 'public/images')));


// app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))