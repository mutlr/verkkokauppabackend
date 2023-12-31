require('dotenv').config()
const mysql = require('mysql2/promise');
const cors = require('cors');
const express = require('express');

const productRoute = require('./routes/product'); 
const userRoute = require('./routes/user');
const orderRoute = require('./routes/order');
const categoriesRoute = require('./routes/categories')
//Express settings
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

//Add routes
app.use('/', userRoute );
app.use('/', orderRoute );
app.use('/products', productRoute );
app.use('/categories', categoriesRoute)

//Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});

