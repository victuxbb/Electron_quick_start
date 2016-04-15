'use strict';

const electron = require('electron');
var http = require('http');
var ipc = require('ipc');
var request = require('superagent');
var dispatcher = require('httpdispatcher');
var net    = require('net'), Socket = net.Socket;

var clients = [];

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const PORT_SERVER=6666;

var LAN = '172.30.15'; //Local area network to scan (this is rough)

//scan over a range of IP addresses and execute a function each time the LLRP port is shown to be open.
for(var i=90; i <=100; i++){
  request
      .get(LAN+'.'+i+PORT_SERVER+'/healthcheck')
      .end(function(err, res){
        console.log(res);
      });
}


function handleRequest(request, response){
  try {
    //log the request on console
    console.log(request.url);
    //Disptach
    dispatcher.dispatch(request, response);
  } catch(err) {
    console.log(err);
  }

}

//For all your static (js/css/images/etc.) set the directory name (relative path).
dispatcher.setStatic('resources');

//A sample POST request
dispatcher.onPost("/", function(req, res) {
  mainWindow.webContents.send('msg',JSON.parse(req.body));
  res.end('Ok');

});

dispatcher.onGet("/healthcheck", function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('live!');
});


//Create a server
var server = http.createServer(handleRequest);
//Lets start our server
server.listen(PORT_SERVER, function(){
  //Callback triggered when server is successfully listening. Hurray!
  console.log("Server listening on: http://localhost:%s", PORT_SERVER);
});
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 768});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

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
      .post('http://172.30.15.99:'+PORT_SERVER)
      .send({ msg: data })
      .set('Accept', 'application/json')
      .end(function(err, res){
        //console.log(res.text);
      });
});