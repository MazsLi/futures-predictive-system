import {ipcRenderer} from 'electron';

export default {

    readFile: readFile,
    readExcel: readExcel,
    window: {
        getWindowWidth: getWindowWidth,
        getWindowHeight: getWindowHeight,
    }

}

function readFile(filePath) {
    return ipcRenderer.sendSync('api.readFile', filePath);
}

function readExcel(filePath) {
    return ipcRenderer.sendSync('api.readExcel', filePath);
}

function getWindowWidth() {
    return ipcRenderer.sendSync('api.window.getWindowWidth');
}

function getWindowHeight() {
    return ipcRenderer.sendSync('api.window.getWindowHeight');
}