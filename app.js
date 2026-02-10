import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/volunteer", volunteerRoutes);

export default app;
