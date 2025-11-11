import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db/index.js";

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed!", error);
    throw error;
  });
