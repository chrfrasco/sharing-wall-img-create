//@ts-check
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");

const createRenderer = require("./renderer");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(morgan("combined"));

let renderer;
app.get("/", async (req, res) => {
  const content = await renderer.quote({
    quote: "Hello, world",
    name: "Christan Scott"
  });
  res.status(200).send(content);
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).json({ msg: "something went wrong" });
});

createRenderer()
  .then(createdRenderer => {
    renderer = createdRenderer;
    // eslint-disable-next-line no-console
    app.listen(port, () => console.log(`app is listening on :${port}`));
  })
  // eslint-disable-next-line no-console
  .catch(e => console.error(`failed to init browser: ${e}`));
