var path = require("path");
var sqlite3 = require('@vscode/sqlite3').verbose();
var db = new sqlite3.Database(path.join(__dirname, 'sql/UserTimeData.db'));

db.serialize(function() {

  db.run("INSERT INTO table_node VALUES('ss', 'kim');")
  db.each("SELECT * FROM table_node;", function(err, row) {
      console.log(row.name + ": " + row.context);
  });
});

db.close()