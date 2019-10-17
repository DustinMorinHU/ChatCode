console.log('renderer process 1');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path')
const url = require('url')
const remote = require('electron');
const electron = require('electron');
const app = electron.app
const Button = document.getElementById('button1');
var text1 = document.getElementById('Logintxt');
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
  hide(text1);
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
    const myUsr = document.getElementById("myUsr").value.toLowerCase();
    const myPwd = document.getElementById("myPwd").value;
    console.log('Provided Username: ' + myUsr);
    name = con.query('SELECT * FROM Login',(err, rows, fields)=>{
      if(!err){
        var text = [];
        var i;
          for (i = 0; i < rows.length; i++) {
            text.push(rows[i].Username.toLowerCase());
            }
        console.log(text)
        var nameInput = myUsr.toLowerCase()
        var x;
        if ((text.indexOf(myUsr) != '-1')){
          console.log(text.indexOf(myUsr));
          var username = rows[text.indexOf(myUsr)].Username.toLowerCase();
          console.log(username);
          var pass = [];
          var i;
            for (i = 0; i < rows.length; i++) {
              pass.push(rows[i].Password);
              }
            if (text.indexOf(myUsr) == pass.indexOf(myPwd, text.indexOf(myUsr))){
              console.log('SUCCESS!')
              let chatWin = new BrowserWindow({ width: 1280, height: 720 });
              chatWin.loadURL(url.format({
                  pathname: path.join(__dirname, 'ChatCode.html'),
                  protocol: 'file:',
                  slashes: true
                }));
                window.close()
            }
            else{
              console.log("Incorrect Password!")
              show(text1)
              document.getElementById('Logintxt').innerHTML = "Incorrect password!";
            }
          }
        else {
          console.log('No match!')
          show(text1)
          document.getElementById('Logintxt').innerHTML = "Username does not exist!";
        }
      }
      else {
        console.log(err);
        console.log('database failure');
      }
    });
  });
const ExitBtn = document.getElementById('CloseBtn');
ExitBtn.addEventListener('click', function(event) {
window.close()})
