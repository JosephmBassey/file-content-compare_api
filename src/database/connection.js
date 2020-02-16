import mongoose from 'mongoose';

const connection = () => {
  if (process.env.NODE_ENV === 'production') {
    return mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  }
  return mongoose.connect('mongodb://localhost:27017/compareContenAPI', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,

  });
};

export default connection;