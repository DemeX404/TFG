/*El proceso main se encargará de crear una nueva ventana, que cargará la GUI de la aplicación en
index.html, donde tenemos el script renderer el cual se encarga de manejar la GUI*/

const { app, BrowserWindow } = require('electron');

let win = null;
//No podia cargar el require(fs) porque faltaba el contextIsolation
app.on('ready', function () {
    win = new BrowserWindow({
        width: 1000, height: 800,
        webPreferences: { nodeIntegration: true, enableRemoteModule: true}
    });
    win.loadURL(`file://${__dirname}/www/index.html`);
});