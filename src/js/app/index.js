const { app, BrowserWindow } = require('electron');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

if (env == 'development') {
  require('electron-reload')(["public", "src/html"], {
    electron: "node_modules/.bin/electron-forge",
    electronArgv: ['start'],
  });
}

function createWindow () {
  const win = new BrowserWindow({
    minWidth: 1080,
    minHeight: 600,
    nodeIntegration: true,
    webPreferences: {
      contextIsolation: true, // protect against prototype pollution
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.webContents.openDevTools();
  win.setMenuBarVisibility(false);
  win.loadFile('./src/html/index.html');
}

app.whenReady().then(() => {
  var commandHandler = require("./CommandHandler.js");

  createWindow();
})
