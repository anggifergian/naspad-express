const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 9000;
const app = express();

// Enable CORS
app.use(cors())

// Allow JSON request
app.use(bodyParser.json())

// Allow x-www-form-urlencoded request
app.use(bodyParser.urlencoded({ extended: true }))

// Main route v1
app.use('/api/v1', require('./router'))

// Start server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))