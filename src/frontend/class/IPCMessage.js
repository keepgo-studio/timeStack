class IPCMessage {
  constructor(channel , jsonData) {
    this.channel = channel;
    this.jsonData = jsonData;
  }

  getMessage() {
    return {
      "channel": this.channel,
      "jsonData": this.jsonData
    }
  }

  setChannel(channel) { this.channel = channel}
  
  setJsonData(jsonData) { this.jsonData = jsonData }
}

export default IPCMessage;