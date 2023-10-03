"use strict";
const electron = require("electron");
const node_os = require("node:os");
const node_path = require("node:path");
const electronPosPrinter = require("electron-pos-printer");
const electronUpdater = require("electron-updater");
const path = require("path");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const { exec } = require("child_process");
require("electron-log");
process.env.DIST_ELECTRON = node_path.join(__dirname, "..");
process.env.DIST = node_path.join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? node_path.join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
if (node_os.release().startsWith("6.1"))
  electron.app.disableHardwareAcceleration();
if (process.platform === "win32")
  electron.app.setAppUserModelId(electron.app.getName());
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
let win = null;
const preload = node_path.join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = node_path.join(process.env.DIST, "index.html");
async function createWindow() {
  win = new electron.BrowserWindow({
    title: "MenuCardápio.Digital",
    icon: node_path.join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.setMenu(null);
  win.maximize();
  electron.ipcMain.handle("get-printers-list", async () => {
    async function sh() {
      return new Promise(function(resolve, reject) {
        exec("wmic printer list brief", (err, stdout, stderr) => {
          if (err) {
            reject(err);
            return;
          }
          stdout = stdout.split("  ");
          var printers = [];
          let j = 0;
          stdout = stdout.filter((item) => item);
          for (let i = 0; i < stdout.length; i++) {
            if (stdout[i] == " \r\r\n" || stdout[i] == "\r\r\n") {
              printers[j] = stdout[i + 1];
              j++;
            }
          }
          resolve({ printers, stdout });
        });
      });
    }
    let data = await sh();
    return data;
  });
  electron.ipcMain.handle("print-data-order", async (event, ...args) => {
    const newData = args;
    let dataPrint = JSON.parse(newData);
    let getPrinterData = JSON.parse(dataPrint.printer);
    let result = dataPrint.item;
    const options = {
      preview: false,
      margin: "0 10px 0 10px",
      copies: 1,
      printerName: getPrinterData.impressora,
      printBackground: true,
      timeOutPerLine: 400,
      pageSize: getPrinterData.largura + "mm",
      silent: true
    };
    let data = [
      {
        type: "text",
        // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Pedido " + result.codigo_pedido,
        style: { fontWeight: "700", textAlign: "center", fontSize: "20px", marginBottom: "40px" }
      },
      {
        type: "text",
        // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Cliente: " + result.cli_name,
        style: { fontWeight: "400", textAlign: "left", marginBottom: "5px", fontSize: "16px" }
      },
      {
        type: "text",
        // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Telefone: " + result.phone,
        style: { fontWeight: "400", textAlign: "left", marginBottom: "5px", fontSize: "16px" }
      },
      {
        type: "text",
        // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: result.tipo_pedido === "delivery" ? "Tipo de pedido: Entrega" : "Tipo de pedido: Comer na Praça",
        style: { fontWeight: "400", textAlign: "left", marginBottom: "5px", fontSize: "16px" }
      },
      {
        type: "text",
        // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: result.payment_type === "money" ? "Forma de Pagamento: Dinheiro" : "Forma de Pagamento: Cartão",
        style: { fontWeight: "400", textAlign: "left", marginBottom: "5px", fontSize: "16px" }
      },
      {
        type: "text",
        // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Troco para: R$ " + result.troco,
        style: { fontWeight: "400", textAlign: "left", borderBottom: "1px solid #000000", paddingBottom: "15px", marginBottom: "30px", fontSize: "16px" }
      },
      {
        type: "text",
        // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Taxa de Entrega: R$ " + result.total_frete,
        style: { fontWeight: "400", textAlign: "left", marginBottom: "5px", fontSize: "16px" }
      },
      {
        type: "text",
        // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Valor do Pedido: R$ " + result.total_pedido,
        style: { fontWeight: "400", textAlign: "left", marginBottom: "5px", fontSize: "16px" }
      },
      {
        type: "text",
        // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Valor Total: R$ " + result.total_soma,
        style: { fontWeight: "400", textAlign: "left", borderBottom: "1px solid #000000", paddingBottom: "15px", marginBottom: "30px", fontSize: "16px" }
      }
    ];
    if (result.tipo_pedido === "delivery") {
      data.push(
        {
          type: "text",
          // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: "Endereço: " + result.rua,
          style: { fontWeight: "400", textAlign: "left", marginBottom: "5px", fontSize: "16px" }
        },
        {
          type: "text",
          // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: "Bairro: " + result.bairro,
          style: { fontWeight: "400", textAlign: "left", marginBottom: "5px", fontSize: "16px" }
        },
        {
          type: "text",
          // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: "Complemento: " + result.complemento,
          style: { fontWeight: "400", textAlign: "left", marginBottom: "5px", fontSize: "16px" }
        },
        {
          type: "text",
          // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: "CEP: " + result.cep,
          style: { fontWeight: "400", textAlign: "left", borderBottom: "1px solid #000000", paddingBottom: "15px", marginBottom: "30px", fontSize: "16px" }
        }
      );
    }
    let itensCardapio = JSON.parse(result.pedido_itens);
    let carrinho = [];
    itensCardapio.forEach((item) => {
      let cartTemp = [];
      cartTemp.push(item.item);
      cartTemp.push(item.qtd);
      cartTemp.push(item.price);
      carrinho.push(cartTemp);
    });
    data.push(
      {
        type: "text",
        // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Observação: " + result.observacao,
        style: { fontWeight: "600", textAlign: "left", borderBottom: "1px solid #000000", paddingBottom: "15px", marginBottom: "30px", fontSize: "16px" }
      },
      {
        type: "text",
        // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: "Itens do pedido: ",
        style: { fontWeight: "700", textAlign: "left", marginBottom: "5px", fontSize: "20px" }
      },
      {
        type: "table",
        // style the table
        style: { border: "1px solid #000000" },
        // list of the columns to be rendered in the table header
        tableHeader: ["Item", "Qtd", "Total"],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: carrinho,
        // custom style for the table body
        // list of columns to be rendered in the table footer
        tableFooter: ["Item", "Qtd", "Total"],
        // custom style for the table header
        tableHeaderStyle: { color: "#000000" },
        // custom style for the table body
        tableBodyStyle: { "border": "2px solid #00000" },
        // custom style for the table footer
        tableFooterStyle: { color: "#000000" }
      }
    );
    electronPosPrinter.PosPrinter.print(data, options).then(console.log).catch((error) => {
      console.error(error);
    });
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url);
    win.webContents.openDevTools();
    electronUpdater.autoUpdater.updateConfigPath = path__namespace.join(
      __dirname,
      "../dev-app-update.yml"
      // change path if needed
    );
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      electron.shell.openExternal(url2);
    return { action: "deny" };
  });
  process.env.GH_TOKEN = "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";
  electronUpdater.autoUpdater.autoDownload = false;
  electronUpdater.autoUpdater.checkForUpdates();
}
electron.app.on("ready", function() {
  createWindow();
  electronUpdater.autoUpdater.checkForUpdatesAndNotify();
});
electronUpdater.autoUpdater.on("update-available", () => {
  electron.ipcRenderer.invoke("updater", "update_available");
});
electronUpdater.autoUpdater.on("update-not-available", () => {
  electron.ipcRenderer.invoke("updater", "update_not_available");
});
electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    electron.app.quit();
});
electron.app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
electron.app.on("activate", () => {
  const allWindows = electron.BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
electron.ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new electron.BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
    electronUpdater.autoUpdater.updateConfigPath = path__namespace.join(
      __dirname,
      "../dev-app-update.yml"
      // change path if needed
    );
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
//# sourceMappingURL=index.js.map
