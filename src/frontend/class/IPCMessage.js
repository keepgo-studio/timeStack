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

  getChannel() { return this.channel}
  setChannel(channel) { this.channel = channel}
  
  getJsonData() { return this.jsonData }
  setJsonData(jsonData) { this.jsonData = jsonData }
}

export default IPCMessage;