const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

const icon = nativeImage.createFromPath('./assets/logos/png/128x128.png');

if (process.env.NODE_ENV == 'development') {
  require('electron-reload')(["public", "src/html"], {
    electron: "node_modules/.bin/electron-forge",
    electronArgv: ['start'],
  });
}

function createWindow () {
  const win = new BrowserWindow({
    icon: icon,
    minWidth: 1080,
    minHeight: 600,
    nodeIntegration: true,
    webPreferences: {
      contextIsolation: true, // protect against prototype pollution
      preload: path.join(__dirname, 'preload.js')
    }
  });
  if (process.env.NODE_ENV == 'development') {
    win.webContents.openDevTools();
  }
  win.setMenuBarVisibility(false);
  win.loadFile('./src/html/index.html');
}

app.whenReady().then(() => {
  var commandHandler = require("./CommandHandler.js");

  createWindow();
})
