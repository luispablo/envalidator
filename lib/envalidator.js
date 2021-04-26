
const fs = require("fs");

const findMissing = function findMissing (filename) {
  const content = fs.readFileSync(filename, { encoding: "utf-8" });
  const items = content.split("process.env.");
  const missingVariables = [];

  if (items.length > 1) {
    for (let i = 1; i < items.length; i++) {
      const varname = items[i].match(/^[a-z_0-9\s]+/igm)[0];
      if (process.env[varname] === undefined) missingVariables.push(varname);
    }
  }

  return missingVariables;
};

const analyzePath = function analyzePath (path) {
  const missing = [];
  const files = fs.readdirSync(path, { withFileTypes: true });
  for (const file of files) {
    const filename = `${path}/${file.name}`;
    if (file.isDirectory() && file.name[0] !== "." && file.name !== "node_modules") missing.push(...analyzePath(filename));
    else if (file.name.toLowerCase().endsWith(".js")) missing.push(...findMissing(filename));
  }
  return missing;
};

const envalidator = function envalidator (rootPath) {

  const missingVariables = analyzePath(rootPath);

  return function envalidatorMiddleware (req, res, next) {
    if (missingVariables.length === 0) next();
    else {
      const html = fs.readFileSync(`${__dirname}/alert_message.html`, { encoding: "utf-8" });
      const lis = missingVariables.map(v => `<li class="list-group-item">${v}</li>`);
      const completeHtml = html.replace("__CONTENT__", lis.join(""));
      res.send(completeHtml);
    }
  };
};

module.exports = envalidator;
