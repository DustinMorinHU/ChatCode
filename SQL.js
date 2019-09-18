function connectToDatabase(ID)
{
    var sql = require("mysql");
    // Database Configuration
    var con = sql.createConnection({
        host: 'Morin.tk',
        user: 'root',
        password: '',
        server: 'Morin.tk',
        database: 'Login',
    });
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });
}
