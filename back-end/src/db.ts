import mongoose from 'mongoose';
import config from './config';

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function() {
  console.log("MongoDB connected!");
});

export default mongoose.connection;
