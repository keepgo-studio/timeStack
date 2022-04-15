const {
  BrowserWindow,
  app,
  ipcMain,
  nativeTheme,
  dialog,
  MessageChannelMain,
} = require("electron");
const path = require("path");

const isDevEnv = process.env.NODE_ENV === "development";

if (isDevEnv) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname,'../node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

let timerWindow = null;
let dashboardWindow = null;
let worker = null;

const closeAllWindow = () => {
  timerWindow.destroy();
  dashboardWindow.destroy();
  worker.destroy();
};

const createWindow = () => {
  
  timerWindow = new BrowserWindow({
    width: 360,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "frontend/preload/timer.preload.js"),
      // nodeIntegration: true,
      // contextIsolation: false
    },
  });
  timerWindow.loadURL(path.join(__dirname, "frontend/pages/timer.html"));

  dashboardWindow = new BrowserWindow({
    width: 1200,
    height: 740,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "frontend/preload/dashboard.preload.js"),
    },
  });
  dashboardWindow.loadURL(path.join(__dirname, "frontend/pages/dashboard.html"));

  worker = new BrowserWindow({
    title: "Backend",
    show: false,
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    },
  });
  worker.loadURL(path.join(__dirname, "backend/worker.html"));
  worker.webContents.openDevTools();

  if (isDevEnv) {
    // timerWindow.webContents.openDevTools({ mode:"detach" });
    dashboardWindow.webContents.openDevTools();
  }

  timerWindow.setResizable(false);

  timerWindow.on("close", () => {
    if (dashboardWindow.isVisible()) {
      timerWindow.hide();
    } else {
      let idx = dialog.showMessageBoxSync(timerWindow ,{
        message: "click",
        buttons: ["on", "off"],
      });
      
      if (idx == 1) {
        closeAllWindow();
      }
    }
  });

  dashboardWindow.on("close", () => {
    if (timerWindow.isVisible()) {
      dashboardWindow.hide();
    } else {
      let idx = dialog.showMessageBoxSync(dashboardWindow ,{
        message: "click",
        buttons: ["on", "off"],
      });

      if (idx == 1) { closeAllWindow(); }
    }
  });
};

// setting for events that comes from front end renderer
const handleRendererEvents = () => {
  // dark mode
  ipcMain.handle("dark-mode:toggle", () => {
    if (nativeTheme.shouldUseDarkColors) 
      nativeTheme.themeSource = "light";
    else 
      nativeTheme.themeSource = "dark";

    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle("dark-mode:init", () => {
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle("always-on-top:toggle", () => {
    let status = null;
    if (timerWindow.isAlwaysOnTop()) status = false
    else status = true

    timerWindow.setAlwaysOnTop(status, "pop-up-menu")
    return status;
  })

  ipcMain.handle("dashboard:open", () => {
    if (!dashboardWindow.isVisible()) dashboardWindow.show();
  })

  // worker process event handler
  ipcMain.on("request-worker-channel", (event) => {
    if (event.senderFrame === timerWindow.webContents.mainFrame) {
      const { port1, port2 } = new MessageChannelMain();

      worker.webContents.postMessage('connect-new-client', null, [port1]);
      event.senderFrame.postMessage('provide-worker-channel', null, [port2]);
    }
  });
};

app.whenReady().then(() => {
  createWindow();
  handleRendererEvents();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
