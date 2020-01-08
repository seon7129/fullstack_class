const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const _webPort = 80;//link:80
global.app = express();
app.use(cors());
global.router = express.Router();
global.path = __dirname;
app.use(bodyParser.json());
app.use("/", router);

router.get("/", (req, res) => {
    res.sendFile(`${path}/web-client/react.html`);
});

router.post("/sum", (req, res) => {
    let sum = req.body.param1 + req.body.param2;
    let result = {
        sum: sum
    }//JASON(Javascript Object Notation)
    res.send(result);
});

app.listen(_webPort, () => {
    console.log(`web server running on ${_webPort}`);
});