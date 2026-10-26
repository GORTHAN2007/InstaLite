const express = require("express");
const usersRouter = require("./routes/users.routes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
