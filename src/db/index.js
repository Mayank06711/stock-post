import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${process.env.MONGO_DB_NAME}`
    );
    console.log(
      ` SEE me in src db index.js IF you Forgot \n
       DATABASE CONNECTION ESTABLISHED With DB Host !! ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(
      ` MONGODB CONNECTION FAILED: with data base: ${process.env.MONGO_DB_NAME} \n FROM db.index.js`,
      error
    );
    process.exit(1);
  }
};

export default connectDB;
