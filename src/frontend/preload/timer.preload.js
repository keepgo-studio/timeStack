const { contextBridge, ipcRenderer } = require('electron');

let workerChannel;

contextBridge.exposeInMainWorld('darkMode', {
    init: () => ipcRenderer.invoke('dark-mode:init'),
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
})

contextBridge.exposeInMainWorld('alwaysOnTop', {
    toggle: () => ipcRenderer.invoke('always-on-top:toggle')
})

contextBridge.exposeInMainWorld('openDashboard', {
    open: () => ipcRenderer.invoke('dashboard:open')
})
// ipcRenderer.send('request-worker-channel');

// ipcRenderer.once('provide-worker-channel', (event)=> {
//     console.log("timer process connected with worker process!");

//     const [ port ] = event.ports;
//     workerChannel = port;

//     port.onmessage = ({ data }) => {
        
//     }
// });

window.onbeforeunload = (e) => { e.returnValue = false; }