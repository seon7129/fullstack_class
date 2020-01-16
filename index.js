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

// router.post("/sum", (req, res) => {
//     let sum = req.body.param1 + req.body.param2;
//     let result = {
//         sum: sum
//     }//JASON(Javascript Object Notation)
//     res.send(result);
// });

const mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wjddbtjs7129',
    database: 'fullstackDB'
});

connection.connect();
let check_user_exists = (email, cb) => {
    connection.query(
    `
        SELECT count(id) as CNT
          FROM user
         WHERE email = '${email}';
    `
    , (err, results, faields) => {
        if(err) {
            console.error(err);
        } else {
            console.log(results[0].CNT);
            let user_exist = results[0].CNT;
            if(user_exist === 0){
                cb(false);
            } else if(user_exist === 1){
                cb(true);
            }
        }
    });
};

let add_user = (email, cb) => {
    console.log(email);
    connection.query(
    `
        INSERT INTO user (email)
        VALUES ('${email}');
    `
    , (err, results, faields) => {
        if(err) {
            console.error(err);
            cb(false);
        } else {
            cb(true);
        }
    });
}

// +
router.post('/add_user', (req, res) => {
    let email = '';
    email = req.body.email;
    if(email === undefined){
        res.send({
            result: 2
        });
    } else {
        check_user_exists(email, (result)=> {
            if(result === true){
                console.log('This user already exist.');
                res.send({
                    result: 1
                });
            } else if (result === false) {
                console.log('Add new user.');
                add_user(email, (result) => {
                    if(result === true){
                        console.log('Added new user.');
                        res.send({
                            result: 0
                        });
                    } else if (result === false) {
                        console.log('Something wrong.');
                        res.send({
                            result: 1
                        });
                    }
                });
            }
        });
    }
});

process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

app.listen(_webPort, () => {
    console.log(`web server running on ${_webPort}`);
});