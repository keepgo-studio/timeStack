const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('alwaysOnTop', {
    toggle: () => ipcRenderer.invoke('always-on-top:toggle')
})

window.onbeforeunload = (e) => { e.returnValue = false; }
