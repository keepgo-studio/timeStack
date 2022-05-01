var electron = require("electron");
var { IPCMessage } = require("./class/IPCMessage");

var path = require("path");
var sqlite3 = require('@vscode/sqlite3').verbose();
var db = new sqlite3.Database(path.join(__dirname, 'sql/UserTimeData.db'));

function postAlertMessage(port, status, message) {
  const msg = new IPCMessage();

  if (status) {
    msg.setChannel('worker--success')
  } else {
    msg.setChannel('worker--failed')
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
  memo_of_period
) {
  const sql = `
    INSERT INTO stack_node(
      year,
      month,
      start_date,
      end_date,
      start_time,
      end_time,
      total_time,
      ${memo_of_period ? "memo_of_period": ""}
      ) VALUES(
      ${year},
      ${month + 1},
      ${start_date},
      ${end_date},
      '${start_time}',
      '${end_time}',
      '${totalTime}',
      ${memo_of_period || ""}
    );
  `.replace(/\s+/g," ")


  return new Promise((resolve, reject) => {
    db.run(sql, err => {
      if (err) {
        console.log("error", err)
        
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
async function saveMemo(
  data
) {
  const sql = `
    INSERT INTO memo(
      editor_js_blocks
      ) VALUES(
      '${data}'
    );
  `.replace(/\s+/g," ")


  return new Promise((resolve, reject) => {
    db.run(sql, function (err){
      if (err) {
        console.log("error", err)
        
        reject({
          status: false,
          message: "데이터를 넣는데 실패하였습니다."
        });
      } else {
        console.log("success")
        db.serialize();

        resolve({
          status: true,
          message: "데이터를 넣는데 성공하였습니다.",
          id: this.lastID
        });
      }
    })
  })
}

module.exports = {
  postAlertMessage,
  saveStackNode,
  saveMemo
}