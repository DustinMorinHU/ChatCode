console.log('renderer process 1');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path')
const url = require('url')
const remote = require('electron');
const electron = require('electron');
const app = electron.app
const Button = document.getElementById('SignupBtn');
Button.addEventListener('click', function(event) {
    console.log('Login Button Clicked!');
    var sql = require("mysql");
    // Database Configuration
    var con = sql.createConnection({
        host:"Morin.tk",
        user: 'root',
        password: '',
        server: 'Morin.tk',
        database: 'Login',
    });
    const newUsr = document.getElementById("newUsr").value;
    const newPwd = document.getElementById("newPwd").value;
    const newPwd1 = document.getElementById("newPwd1").value;
    console.log('Provided Username: ' + newUsr);
    name = con.query('SELECT * FROM Users',(err, rows, fields)=>{
      if(!err){
        var text = [];
        var i;
          for (i = 0; i < rows.length; i++) {
            text.push(rows[i].username);
            }
        console.log(text)
        len = newUsr.length
        console.log(len)
        if (text.indexOf(newUsr) == '-1' && len >= 6){
            if (newPwd == newPwd1 && newPwd != null){
              info = [[newUsr, newPwd]];
              con.query('INSERT INTO Users(username, password) VALUES ?',[info],(err, results, fields) => {
                  if (err) {
                    return console.error(err.message);
                  }
                });
              console.log('SUCCESS!')
            }
            else{
              console.log('Passwords didnt match')
            }
        }
        else {
          console.log('Username Taken!')
        }
      }
      else {
        console.log(err);
        console.log('database failure');
      }
    });
  });
const ExitBtn = document.getElementById('CloseBtn1');
ExitBtn.addEventListener('click', function(event) {
window.close()})
