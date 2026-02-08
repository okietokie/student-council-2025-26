import connectDB from "./config/mongoConnectivity.js";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/authroutes.js";
import councilRoutes from "./routes/councilRoutes.js";
import classRoutes from './routes/classRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/council', councilRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);


// Start Server
async function startServer() {
  try {
    await connectDB(); //connect to Mongodb

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    
    );

  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
}

startServer();