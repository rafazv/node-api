const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./database');

const app = express();
const PORT = 3100;
const HOST = '0.0.0.0';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers/index')(app);

app.listen(PORT, HOST);