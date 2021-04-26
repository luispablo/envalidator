
const fs = require("fs");

const findMissing = function findMissing (filename) {
  const content = fs.readFileSync(filename, { encoding: "utf-8" });
  const items = content.split("process.env.");
  const files = [];

  if (items.length > 1) {
    for (let i = 1; i < items.length; i++) {
      const varname = items[i].match(/^[a-z_0-9\s]+/igm)[0].trim();
      if (process.env[varname] === undefined) {
        const [file] = files.filter(f => f.filename === filename);
        if (file) file.vars.push(varname);
        else files.push({ filename, vars: [varname] });
      }
    }
  }

  return files;
};

const findFilesWithIssues = function findFilesWithIssues (path) {
  const missing = [];
  const files = fs.readdirSync(path, { withFileTypes: true });
  for (const file of files) {
    const filename = `${path}/${file.name}`;
    if (file.isDirectory() && file.name[0] !== "." && file.name !== "node_modules") missing.push(...findFilesWithIssues(filename));
    else if (file.name.toLowerCase().endsWith(".js")) missing.push(...findMissing(filename));
  }
  return missing;
};

module.exports = findFilesWithIssues;
