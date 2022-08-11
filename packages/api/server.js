const express = require('express');
const cors = require('cors');
const apiDataHandler = require('./src/apiData');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/data', apiDataHandler);

app.listen(3001, () => console.log('listening on 3001'));
