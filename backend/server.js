const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("Client connected: " + socket.id);
});

app.set("io", io);

// Update alertController to emit real-time event
// After alert.save():
//io.emit("newAlert", alert);


// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/iocs", require("./routes/iocs"));
app.use("/api/logs", require("./routes/logs"));
app.use("/api/actors", require("./routes/actors"));
app.use("/api/risks", require("./routes/risks"));
app.use("/api/alerts", require("./routes/alerts"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
