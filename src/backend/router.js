var { 
  postAlertMessage,
  saveStackNode
} = require("./controller");
var { IPCMessage } = require("./class/IPCMessage");

module.exports = async function (port, { data }) {
  const msg = new IPCMessage(data.channel, {})

  switch (data.channel) {
    case "save-stack-node":
      const startDate = new Date(data.jsonData.startDateTime);
      const endDate = new Date(data.jsonData.endDateTime);
      const totalTime = data.jsonData.totalTime
      // const { status, message } = 
      
      if((endDate - startDate) > 600000){
        saveStackNode(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          endDate.getDate(),
          `${startDate.getHours()}/${startDate.getMinutes()}`,
          `${endDate.getHours()}/${endDate.getMinutes()}`,
          totalTime
        )
        .then(({ status, message })=>postAlertMessage(port, status, message))
        .catch(({ status, message })=>postAlertMessage(port, status, message));
      } else {
        postAlertMessage(port, false, "너무 짧아요 😥 최소 10분은 해야해요!")
      }
  }
}