const express = require('express');

const PORT = process.env.PORT || 9000;
const app = express();

// Main route
app.use('/api/v1', require('./router'))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))