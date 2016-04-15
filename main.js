import app from 'app';
import BrowserWindow from 'browser-window';
import RestChatServer from './chat/infrastructure/server/RestChatServer';


var ipc = require('ipc');
var request = require('superagent');



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

var restChatServer = new RestChatServer(6666,mainWindow);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
// Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 768});

// and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

// Open the DevTools.
//mainWindow.webContents.openDevTools();

  //mainWindow.webContents.send('online', clients);

// Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});


ipc.on('invokeAction', function(event, data){
  request
      .post('http://172.30.15.99:6666')
      .send({ msg: data })
      .set('Accept', 'application/json')
      .end(function(err, res){
        //console.log(res.text);
      });
});