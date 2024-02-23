import mongoose from "mongoose";

const dbConnection = mongoose
  .connect(
    "mongodb://sudhan-dev:sudhan-dev@168.119.170.236:27017/sudhandev?authMechanism=DEFAULT&authSource=admin"
  )
  //   mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authMechanism=DEFAULT&authSource=admin
  .then(() => {
    console.log("Database connection is ready.....");
  })
  .catch((error) => {
    console.log(`Error : ${error}`);
  });

export { dbConnection };
