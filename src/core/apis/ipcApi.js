import Fs from 'fs';
import {ipcMain} from 'electron';
import Excel from './excel';

export default (browserWindow) => {

    ipcMain.on('api.readFile', (event, filePath) => {

        event.returnValue = Fs.readFileSync(filePath, 'utf8');

    })

    ipcMain.on('api.readExcel', (event, filePath) => {
        
        Excel.readExcel(filePath, (result) => {
            event.returnValue = result;
        })
        
    })

    ipcMain.on('api.window.getWindowHeight', (event) => {
        
        event.returnValue = browserWindow.getSize()[1];
    })

    ipcMain.on('api.window.getWindowWidth', (event) => {
        
        event.returnValue = browserWindow.getSize()[0];
    })

}
