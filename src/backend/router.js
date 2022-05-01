var { 
  postAlertMessage,
  saveStackNode,
  saveMemo
} = require("./controller");
var { IPCMessage } = require("./class/IPCMessage");

module.exports = async function (port, { data }) {
  const msg = new IPCMessage(data.channel, {})

  var startDate;
  var endDate;

  switch (data.channel) {

    case "save-stack-node":
      startDate = new Date(data.jsonData.startDateTime);
      endDate = new Date(data.jsonData.endDateTime);
      
      if((endDate - startDate) > 600000){
        saveStackNode(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          endDate.getDate(),
          `${startDate.getHours()}/${startDate.getMinutes()}`,
          `${endDate.getHours()}/${endDate.getMinutes()}`,
          data.jsonData.totalTime
        )
        .then(({ status, message })=>postAlertMessage(port, status, message))
        .catch(({ status, message })=>postAlertMessage(port, status, message));
      } else {
        postAlertMessage(port, false, "너무 짧아요 😥 최소 10분은 해야해요!")
      }

    case "save-memo-to-stack-node":
      if (data.jsonData.editor_js_blocks) {
        saveMemo(data.jsonData.editor_js_blocks)
        .then(({ status, id })=>{
          if (status)
            startDate = new Date(data.jsonData.stack_node.startDateTime);
            endDate = new Date(data.jsonData.stack_node.endDateTime);

            saveStackNode(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate(),
              endDate.getDate(),
              `${startDate.getHours()}/${startDate.getMinutes()}`,
              `${endDate.getHours()}/${endDate.getMinutes()}`,
              data.jsonData.stack_node.totalTime,
              id
            )
            .then(({ status, message })=>postAlertMessage(port, status, message))
            .catch(({ status, message })=>postAlertMessage(port, status, message));
        })
        .catch(({ status, message })=>postAlertMessage(port, status, message));
      }

  }
}