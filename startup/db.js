const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { getEnvVar } = require('../utils/config');

module.exports = async function (app) {
    mongoose.set('strictQuery', false);

    const mongoUri = getEnvVar('MONGO_URI', 'mongodb://localhost:27017/playground');

    mongoose.connect(mongoUri)
        .then(() => logger.info(`Connected to MongoDB at ${mongoUri}...`))
        .catch((err) => {
            logger.error(`Could not connect to MongoDB at ${mongoUri}.`, err);

            if (app) {
                app.use((req, res, next) => {
                    res.status(500).send('Internal Server Error: Could not connect to the database.');
                });
            }
        })
}