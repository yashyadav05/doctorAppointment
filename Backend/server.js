// 1. Load environment variables
require("dotenv").config();

// 2. Basic Express setup
const express = require("express");
const cors = require("cors");
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // Allow cookies
  })
);

app.use(cookie());

// 3. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 5. DB connection
const Maindb = require("./config/database");
Maindb();

// 6. Routes
const authRoutes = require("./routes/login-signup");
const appointmentsRoutes = require("./routes/appointment");
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentsRoutes);

// 7. Start Server
app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
