import mongoose from "mongoose";

const connectToDB = async () => {
  const url =
    "mongodb+srv://raisulaust1:q1w2e3r4@cluster0.kll1i.mongodb.net/";

  mongoose
    .connect(url)
    .then(() => console.log("Database connection is successful"))
    .catch((e) => console.log(e));
};

export default connectToDB;
