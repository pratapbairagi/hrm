const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the environment variable for the database URL
    const dbURI = process.env.DATABASE_URL || 'mongodb+srv://website_ecommerce:18May1994@cluster0.5qgqh.mongodb.net/website_ecommerce?retryWrites=true&w=majority';

    // Establish the connection to MongoDB
    await mongoose.connect(dbURI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log('MongoDB connected!');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit process with failure in case of an error
  }
};

module.exports = connectDB;
