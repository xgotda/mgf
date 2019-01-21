// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')
const {dialog, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
require("electron-reload")(__dirname)


/* Keep a global reference of the window object, if you don't, the window will
 be closed automatically when the JavaScript object is garbage collected. */
let mainWindow

function createWindow () {
  const windowOptions = {
    width: 700,
    height: 550,
    minWidth: 350,
    minHeight: 300,
    title: app.getName()
  }
  if (process.platform === 'linux') {
    windowOptions.icon = path.join(__dirname, '../assets/icons/316.png')
  }

  // Create the browser window.
  mainWindow = new BrowserWindow(windowOptions)

  // Load the index.html of the app.
  // mainWindow.loadFile('index.html')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Build menu from template and insert
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)


  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
  })

}

/* This method will be called when Electron has finished initialization and
 is ready to create browser windows. Some APIs can only be used after
 this event occurs. */
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

/* ---------------------------------------------------------------------------
   In this file you can include the rest of your app's specific main process
   code. You can also put them in separate files and require them here.
 ---------------------------------------------------------------------------- */

// Create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Select mgf file',
        accelerator: process.platform == 'darwin' ? 'Command+O' :
        'Ctrl+O',
        click(){
          openMgfFile()
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' :
        'Ctrl+Q',
        click(){
          app.quit()
        }
      }
    ]
  }
]

ipcMain.on('ofmRequest', function(e){
  result = openMgfFile()
  mainWindow.webContents.send('ofmRequest', result)
})

function openMgfFile() {
  result = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile']
  })
  return result
}

// If mac, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' :
        'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools()
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
