console.log('renderer process 1');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path')
const url = require('url')
const remote = require('electron');
const electron = require('electron');
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
    console.log('Login Button Clicked!');
    var sql = require("mysql");
    // Database Configuration
    var con = sql.createConnection({
        host:"Morin.tk",
        user: 'ChatCode',
        password: 'ChatCode123',
        server: 'Morin.tk',
        database: 'ChatCode',
    });
    const newUsr = document.getElementById("newUsr").value;
    const newPwd = document.getElementById("newPwd").value;
    const newPwd1 = document.getElementById("newPwd1").value;
    console.log('Provided Username: ' + newUsr);
    name = con.query('SELECT * FROM Login',(err, rows, fields)=>{
      if(!err){
        var text = [];
        var i;
          for (i = 0; i < rows.length; i++) {
            text.push(rows[i].Username);
            }
        console.log(text)
        len = newUsr.length
        console.log(len)
        if (text.indexOf(newUsr) == '-1' && len >= 6){
            if (newPwd == newPwd1 && newPwd.length >= 6){
              info = [[newUsr, newPwd]];
              con.query('INSERT INTO Login(username, password) VALUES ?',[info],(err, results, fields) => {
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
