console.log('renderer process 1');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path')
const url = require('url')
const remote = require('electron');
const electron = require('electron');
const app = electron.app;
const crypto = require('crypto');
const Button = document.getElementById('button1');
var ipcRenderer = require('electron').ipcRenderer;

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
		hashPwd = crypto.createHash('sha256').update(myPwd).digest('hex');
		const sql1 = "SELECT * FROM Login WHERE Username = ? AND Password = ?";
    con.query(sql1, [myUsr, hashPwd], (err, results)=> {
			if(!err){
				if (results.length > 0 ){
					const globalVariable={
						id: results[0].UserID
					}
					console.log(globalVariable.id)
					console.log('SUCCESS!')
	        let chatWin = new BrowserWindow({ width: 1280, height: 720});
	        chatWin.loadURL(url.format({
	          pathname: path.join(__dirname, 'ChatCode.html'),
	          protocol: 'file:',
	          slashes: true

	          }));
						chatWin.webContents.on('did-finish-load', ()=>{
	  					chatWin.webContents.send('UserID', results[0].UserID)
							window.close()
						});
					//chatWin.webContents.send('UserID', results[0].UserID)
	      //window.close()
				//chatWin.show()
				//electron.remote.BrowserWindow.mainWindow.close()
				}
				else {
						console.log("Username or password incorrect")
						show(text1)
	        	document.getElementById('Logintxt').innerHTML = "Username or password incorrect";
				};

	  	}
			else {
				console.log(err)
				show(text1)
				document.getElementById('Logintxt').innerHTML = "Something went wrong! Try again later!";
			};
		});
});
const ExitBtn = document.getElementById('CloseBtn');
ExitBtn.addEventListener('click', function(event) {
window.close()})
