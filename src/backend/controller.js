var electron = require("electron");
var { IPCMessage } = require("./class/IPCMessage");

var path = require("path");
var sqlite3 = require('@vscode/sqlite3').verbose();
var db = new sqlite3.Database(path.join(__dirname, 'sql/UserTimeData.db'));

function postAlertMessage(port, status, message) {
  const msg = new IPCMessage();

  if (status) {
    msg.setChannel('worker-success')
  } else {
    msg.setChannel('worker-failed')
  }
  msg.setJsonData({ message });

  port.postMessage(msg.getMessage());
}

async function saveStackNode(
  year,
  month,
  start_date,
  end_date,
  start_time,
  end_time,
  totalTime,
) {
  const sql = `
    INSERT INTO stack_node(
      year,
      month,
      start_date,
      end_date,
      start_time,
      end_time,
      total_time
      ) VALUES(
      ${year},
      ${month + 1},
      ${start_date},
      ${end_date},
      '${start_time}',
      '${end_time}',
      '${totalTime}'
    );
  `.replace(/\s+/g," ")


  return new Promise((resolve, reject) => {
    db.run(sql, err => {
      if (err) {
        console.log("error")
        
        reject({
          status: false,
          message: "데이터를 넣는데 실패하였습니다."
        });
      } else {
        console.log("success")
        db.serialize();

        resolve({
          status: true,
          message: "데이터를 넣는데 성공하였습니다."
        });
      }
    })
  })
}

module.exports = {
  postAlertMessage,
  saveStackNode
}