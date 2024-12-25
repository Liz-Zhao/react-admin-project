const mongoose = require('mongoose');
require('dotenv').config()

const DB = process.env.DATABASE_LOCAL;

const config = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
}

mongoose.connect(DB, config).then(()=>{
    console.log('db connected!')
});

module.exports = mongoose;