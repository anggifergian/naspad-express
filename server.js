const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const PORT = process.env.PORT || 9000;
const app = express();

app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Allow JSON request
app.use(bodyParser.urlencoded({ extended: true })); // Allow x-www-form-urlencoded request
app.use(express.static('public')); // Static files
app.use('/api/v1', require('./router'));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));