const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;
app.on('ready', () => {
  // mainWindow を作成
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 900
  });

  // html を指定
  let path = 'file://' + __dirname + '/index.html';
  mainWindow.loadURL(path);

  // developper tool を開く
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});