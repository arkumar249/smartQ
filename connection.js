const mongoose = require('mongoose');

async function connectToMongoDB(URL) {
  await mongoose.connect(URL);
}

module.exports = {
  connectToMongoDB,
};