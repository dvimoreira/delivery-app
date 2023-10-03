import { app, BrowserWindow, shell, ipcMain, ipcRenderer } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import {PosPrinter, PosPrintData, PosPrintOptions} from "electron-pos-printer";
const { exec } = require('child_process');
import { autoUpdater } from "electron-updater";
import * as path from 'path';
// var Printer = require('zuzel-printer');
const log = require("electron-log");

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'MenuCardápio.Digital',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.setMenu(null)
  win.maximize()

  // ipcMain.handle('get-printers-list', () =>{
  //   console.log('Entrou aqui')
  //   let printers = Printer.list();
  //   return printers
  // });

  ipcMain.handle('get-printers-list', async () =>{
    async function sh () {
      return new Promise(function (resolve, reject) {
        exec('wmic printer list brief', (err, stdout, stderr) => {
          if (err) {
              // node couldn't execute the command
              reject(err)
              return;
          }
          // list of printers with brief details
          // console.log(stdout);
          // the *entire* stdout and stderr (buffered)
          stdout = stdout.split("  ");
          var printers = [];
          let j = 0;
          stdout = stdout.filter(item => item);
          for (let i = 0; i < stdout.length; i++) {
              if (stdout[i] == " \r\r\n" || stdout[i] == "\r\r\n") {
                  printers[j] = stdout[i + 1];
                  j++;
              }
          }
          // list of only printers name
          resolve({printers, stdout})
          // console.log(stderr);
        });
      })
    }

    let data = await sh()
    return data;
  });

  // AQUI IMPRIME O PEDIDO

  ipcMain.handle('print-data-order', async (event, ...args) => {
    const newData = args
    let dataPrint = JSON.parse(newData)
    let getPrinterName = dataPrint.printer
    let result = dataPrint.item

    const options: PosPrintOptions = {
      preview: false,
      margin: '0 0 0 0',
      copies: 1,
      printerName: getPrinterName,
      printBackground: true,
      timeOutPerLine: 400,
      pageSize: '58mm',
      boolean: undefined,
      silent: true
    }

    let data: PosPrintData[] = [
      {
          type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: 'Pedido ' + result.codigo_pedido,
          style: {fontWeight: "700", textAlign: 'center', fontSize: "24px", marginBottom: "40px"}
      },
      {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: 'Cliente: ' + result.cli_name,
        style: {fontWeight: "400", textAlign: 'left', marginBottom: "5px", fontSize: "18px"}
      },
      {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: 'Telefone: ' + result.phone,
        style: {fontWeight: "400", textAlign: 'left', marginBottom: "5px", fontSize: "18px"}
      },
      {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: (result.tipo_pedido === 'delivery') ? 'Tipo de pedido: Entrega' : 'Tipo de pedido: Comer na Praça',
        style: {fontWeight: "400", textAlign: 'left', marginBottom: "5px", fontSize: "18px"}
      },
      {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: (result.payment_type === 'money') ? 'Forma de Pagamento: Dinheiro' : 'Forma de Pagamento: Cartão',
        style: {fontWeight: "400", textAlign: 'left', marginBottom: "5px", fontSize: "18px"}
      },
      {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: 'Troco para: R$ ' + result.troco,
        style: {fontWeight: "400", textAlign: 'left', borderBottom: "1px solid #000000", paddingBottom: "15px", marginBottom: "30px", fontSize: "18px"}
      },
      {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: 'Taxa de Entrega: R$ ' + result.total_frete,
        style: {fontWeight: "400", textAlign: 'left', marginBottom: "5px", fontSize: "18px"}
      },
      {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: 'Valor do Pedido: R$ ' + result.total_pedido,
        style: {fontWeight: "400", textAlign: 'left', marginBottom: "5px", fontSize: "18px"}
      },
      {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: 'Valor Total: R$ ' + result.total_soma,
        style: {fontWeight: "400", textAlign: 'left', borderBottom: "1px solid #000000", paddingBottom: "15px", marginBottom: "30px", fontSize: "18px"}
      }
    ]

    if (result.tipo_pedido === 'delivery') {
      data.push(
        {
          type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: 'Endereço: ' + result.rua,
          style: {fontWeight: "400", textAlign: 'left', marginBottom: "5px", fontSize: "18px"}
        },
        {
          type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: 'Bairro: ' + result.bairro,
          style: {fontWeight: "400", textAlign: 'left', marginBottom: "5px", fontSize: "18px"}
        },
        {
          type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: 'Complemento: ' + result.complemento,
          style: {fontWeight: "400", textAlign: 'left', marginBottom: "5px", fontSize: "18px"}
        },
        {
          type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: 'CEP: ' + result.cep,
          style: {fontWeight: "400", textAlign: 'left', borderBottom: "1px solid #000000", paddingBottom: "15px", marginBottom: "30px", fontSize: "18px"}
        }
      )
    }

    let itensCardapio = JSON.parse(result.pedido_itens)
    let carrinho = []

    itensCardapio.forEach(item => {
      let cartTemp = []
      cartTemp.push(item.item)
      cartTemp.push(item.qtd)
      cartTemp.push(item.price)
      carrinho.push(cartTemp)
    });

    data.push(
      {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: 'Observação: ' + result.observacao,
        style: {fontWeight: "600", textAlign: 'left', borderBottom: "1px solid #000000", paddingBottom: "15px", marginBottom: "30px", fontSize: "18px"}
      },

      {
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: 'Itens do pedido: ',
        style: {fontWeight: "700", textAlign: 'left', marginBottom: "5px", fontSize: "20px"}
      },

      {
        type: 'table',
        // style the table
        style: {border: '1px solid #000000'},
        // list of the columns to be rendered in the table header
        tableHeader: ['Item', 'Qtd', 'Total'],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: carrinho,
        // custom style for the table body
        // list of columns to be rendered in the table footer
        tableFooter: ['Item', 'Qtd', 'Total'],
        // custom style for the table header
        tableHeaderStyle: { color: '#000000'},
        // custom style for the table body
        tableBodyStyle: {'border': '2px solid #00000'},
        // custom style for the table footer
        tableFooterStyle: {color: '#000000'},
      }
    )

    PosPrinter.print(data, options)
      .then(console.log)
      .catch((error) => {
        console.error(error);
      });
  })

  // AQUI TERMINA DE IMPRIMIR O PEDIDO

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()

    autoUpdater.updateConfigPath = path.join(
      __dirname,
      "../dev-app-update.yml" // change path if needed
    );
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
  
  process.env.GH_TOKEN = "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";
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdates();
}

app.on("ready", function() {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-available", () => {
  ipcRenderer.invoke("updater", "update_available");
});
autoUpdater.on("update-not-available", () => {
  ipcRenderer.invoke("updater", "update_not_available");
});

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})


app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
    
    autoUpdater.updateConfigPath = path.join(
      __dirname,
      "../dev-app-update.yml" // change path if needed
    );
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
