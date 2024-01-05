const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRouter = require("./routes/user");

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", userRouter)

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
