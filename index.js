//@ts-check
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");

const createRenderer = require("./renderer");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(morgan("combined"));

function validate(body, properties) {
  let valid = true;
  let missing = [];
  for (const prop of properties) {
    if (body[prop] == null || body[prop] == "") {
      valid = false;
      missing.push(prop);
    }
  }

  const message = `Missing ${missing.map(s => `"${s}"`).join(", ")} in body`;
  return { valid, message };
}

let renderer;

app.get("/", async (req, res) => {
  const { valid, message } = validate(req.query, ["quote", "name"]);
  if (!valid) {
    res.status(400).send(message);
    return;
  }

  const { quote, name } = req.query;
  const img = await renderer.quote({ quote, name });

  const content = `<img src="${img}">`;
  res.status(200).send(content);
});

app.post("/", async (req, res) => {
  const { valid, message } = validate(req.body, ["quote", "name"]);
  if (!valid) {
    res.status(400).send(message);
    return;
  }

  const { quote, name } = req.body;
  const img = await renderer.quote({ quote, name });

  const content = `<img src="${img}">`;
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
