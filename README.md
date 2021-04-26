# envalidator
Express middleware to alert if any needed env variable hasn't been set.

## How to install 

```ssh
npm install --save envalidator
```

## How to use

```javascript
const envalidator = require("envalidator");
const app = express();

app.use(envalidator()); // This will analyze your .js files using the current directory as root
```

Now, if you're trying to access some `process.env` variable in your codebase, instead of responding your expected routes, it'll show a nice warning message.
