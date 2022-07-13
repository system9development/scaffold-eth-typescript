const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const { networkConfig } = require('./src/config');
const apiData = require('./src/apiData');
const Lens = require('./src/Lens');
const Comptroller = require('./src/Comptroller');

const app = express();

app.use(express.json());
app.use(cors())

app.get('/data', async (req, res) => {
  res.send(await apiData());
});

app.listen(3001, () => console.log('listening on 3001'));
