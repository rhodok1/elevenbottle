const express = require("express");
const app = express();
const routes = require("./routes");
const session = require("express-session");
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      sameSite: true,
    },
  })
);
app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
