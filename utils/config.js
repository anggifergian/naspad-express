require('dotenv').config();

const getEnvVar = (key, defaultValue = undefined) => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`FATAL ERROR: Environment variable ${key} is not defined.`);
  }

  return value;
}

module.exports = {
  getEnvVar
}
