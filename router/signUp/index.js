var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mssql')
var crypto = require('crypto');
const salt = crypto.randomBytes(128).toString('base64');

// DATABASE setting
var connections = new mysql.ConnectionPool({
	host: '10.1.1.170',
	user: 'test',
	password: 'Ablecloud1!',
	port: '1433',
	database: 'able_db',
        options: {
            encrypt: true
        }
});

//connection.connect();

//===========
var config = {
	server: '10.1.1.170',
	user: 'test',
	password: 'Ablecloud1!',
	port: 1433,
	database: 'able_db',
        options: {
            encrypt: false
        }
};

const pool = new mysql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))
//===========

router.get('/', function (req, res) {
    if (req.cookies.user){
        res.render('signUp.ejs', {cookie : req.cookies.user});
    }
    else{
        res.render('signUp.ejs', {cookie: "false"});
    }
})

router.post('/', async function (req, res, next) {

	var id = req.body.id;
	var email = req.body.email;
	var password = req.body.pw;

	const hashPassword = crypto.createHash('sha512').update(password + salt).digest('hex');
	var query = "SELECT userid FROM member where userid='" + id + "';"; // 중복 처리하기위한 쿼리

        var pools = await mysql.connect(config)
        pools.request().query(query, function (err, rows) {
		if (rows.length == 0 || rows.length == undefined) { // sql 제대로 연결되고 중복이 없는 경우
			var sql = {
				email: email,
				userid: id,
				password: hashPassword,
				salt: salt
			};
			// create query 
                        var sql2= "INSERT INTO member (userid,email,password,salt) VALUES ('"+id+"','"+email+"','"+hashPassword+"','"+salt+"');";
			var query = pools.request().query(sql2, function (err, rows) {
				if (err) throw err;
				else {
					res.send("성공");
			}
			});
		} else {
			// 이미 있음 
			res.send("중복ID");
		}
	});


})
module.exports = router;