import mongoose from "mongoose";

export async function connect() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "my_database_name", // optional, you can remove this line
    });

    console.log("✅ MongoDB Connected Successfully");

  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error);
  }
}
