require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const routes = require("./Route/route");
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

// Initialize Express
const app = express();

// Connect to Database
db();

// Middleware
app.use(express.json());

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Log origin middleware for debugging
app.use((req, res, next) => {
  
  next();
});

// Routes
app.use("/", routes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});