console.log('renderer process 1');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path')
const url = require('url')
const remote = require('electron');
const electron = require('electron');
const crypto = require('crypto');
const app = electron.app
const Button = document.getElementById('SignupBtn');
var text1 = document.getElementById('Signuptxt');
// Show an element
var show = function (elem) {
	elem.classList.add('is-visible');
};
// Hide an element
var hide = function (elem) {
	elem.classList.remove('is-visible');
};
// Toggle element visibility
var toggle = function (elem) {
	elem.classList.toggle('is-visible');
};
Button.addEventListener('click', function(event) {
    hide(text1)
    console.log('Signup Button Clicked!');
    var sql = require("mysql");
    // Database Configuration
    var con = sql.createConnection({
        host:"Morin.tk",
        user: 'ChatCode',
        password: 'ChatCode123',
        server: 'Morin.tk',
        database: 'ChatCode',
    });
    const newUsr = document.getElementById("newUsr").value.toLowerCase();
    const newPwd = document.getElementById("newPwd").value;
    const newPwd1 = document.getElementById("newPwd1").value;
		sqlQuery = 'SELECT * FROM Login Where Username = ?'
    con.query(sqlQuery, newUsr ,(err, results, fields)=>{
      if(!err){
				if (results.length == 0 && newUsr.length >= 6 &&morin.tk newUsr.indexOf(' ') >= 0){
					if (newPwd == newPwd1 && newPwd.length >= 6){
							hashPwd = crypto.createHash('sha256').update(newPwd).digest('hex');

              info = [[newUsr, hashPwd]];
              con.query('INSERT INTO Login(Username, Password) VALUES ?',[info],(err, results, fields) => {
								console.log('Successful signup!')
                  if (err) {
                    return console.error(err.message);
                  }
                });
              console.log('SUCCESS!');
              show(text1);
              document.getElementById('Signuptxt').innerHTML = "Signup successful!";
            }
            else if(newPwd == newPwd1 && newPwd.length < 6){
              console.log("Password too short!");
              show(text1);
              document.getElementById('Signuptxt').innerHTML = "Password too short!";
            }
            else{
              console.log("Password did not match!");
              show(text1);
              document.getElementById('Signuptxt').innerHTML = "Provided passwords didn't match!";
            }
        }
      else {
          console.log('Username taken or password too Short!');
          show(text1);
          document.getElementById('Signuptxt').innerHTML = "Username taken or too short!";
        }
      }
      else {
        console.log('database failure');
        console.log(err);
        show(text1);
        document.getElementById('Signuptxt').innerHTML = "Something went wrong! Try again later.";
      }
    });
  });
const ExitBtn = document.getElementById('CloseBtn1');
ExitBtn.addEventListener('click', function(event) {
window.close()})
