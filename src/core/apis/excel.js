import Excel from 'exceljs';
import Fs from 'fs';

export default {
    
    readExcel: readExcel,

}

/**
 * 讀取 excel 
 * @param { string } filePath 檔案路徑
 * @param { function } callback 
 */
function readExcel(filePath, callback) {
    
    if(!Fs.existsSync(filePath) && callback) callback(false);

    let workbook = new Excel.Workbook();

    workbook.xlsx.readFile(filePath)
    .then( () => {
        
        let sheet = workbook.getWorksheet(1);
        
        let headerAry = sheet.getRow('1').values;
        let rowData = sheet.getRow('2').values;
        let rowAry = []; 

        headerAry = headerAry.slice(1); // 去第一項空白
        
        rowData.map( (row) => {
            rowAry.push(row.result);
        });
        
        if(callback) callback({
            header: headerAry,
            rowData: [rowAry], 
        })
                
    }).catch( (err) => {
        console.log(err);
        if(callback) callback(false);
    })

}
