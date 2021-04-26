
const findFilesWithIssues = require("./findFilesWithIssues");
const fs = require("fs");

const renderFileItem = function renderFileItem (file) {
  const varsItems = file.vars.sort().map(v => `<li>&emsp;${v}</li>`);
  return `
    <li class="list-group-item">
      <small class="fs-0_7 text-muted">${file.filename}</small><br/>
      <ul class="list-unstyled">${varsItems.join("")}</ul>
    </li>
  `;
};

const envalidator = function envalidator (rootPath) {

  const filesWithIssues = findFilesWithIssues(rootPath);

  return function envalidatorMiddleware (req, res, next) {
    if (filesWithIssues.length === 0) next();
    else {
      const html = fs.readFileSync(`${__dirname}/alert_message.html`, { encoding: "utf-8" });
      const lis = filesWithIssues.map(renderFileItem);
      const completeHtml = html.replace("__CONTENT__", lis.join(""));
      res.send(completeHtml);
    }
  };
};

module.exports = envalidator;
