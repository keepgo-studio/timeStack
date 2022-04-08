const { BrowserWindow, app } = require("electron");
const path = require("path");

const isDevEnv = process.env.NODE_ENV === "development";

if (isDevEnv) {
  try {
    require("electron-reloader")(module);
  } catch {}
}

let timerWindow, dashboardWindow;

const createWindow = () => {
  timerWindow = new BrowserWindow({
    width: 400,
    height: 700,
  });

  dashboardWindow = new BrowserWindow({
    width: 1200,
    height: 740,
    show: false
  })

  if (isDevEnv) {
    timerWindow.webContents.openDevTools();
    dashboardWindow.webContents.openDevTools();
  }

  timerWindow.loadURL(path.join(__dirname, 'pages/timer.html'))
  dashboardWindow.loadURL(path.join(__dirname, 'pages/dashboard.html'))
  
  // mainWindow.setAlwaysOnTop(true, 'screen');
  // mainWindow.setResizable(false);
};


app.whenReady().then(() => {
  createWindow();

  // setTimeout(()=> {
  //   dashboardWindow.show()
  // }, 5000)
  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});