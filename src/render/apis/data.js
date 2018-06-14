
import ApiBackend from './backend';

export default {

    getDaliyData: getDaliyData,
    getAllDayTime: getAllDayTime,
    getMetricsAryWithTime: getMetricsAryWithTime,
    updateDailyData: updateDailyData,

}

let dataStore = {
    'DataName': {
        name: '指數名稱',
        date: '西元年/月/日',
        openingPrice: 10938,      // 開盤價
        closingPrice: 10952,      // 收盤價
        dayHighPrice: 10970,      // 目前(當天)最高價
        dayLowPrice: 10908,       // 目前(當天)最低價
        openingTime: '08:45:00',  // 開盤時間
        closingTime: '13:45:00',  // 收盤時間
        metrics: {                // 每個陣列大小應為一致，無資料應給空值
            timeAry: [],                // 資料時間
            indexAry: [],               // 指數
            totalPreBuySizeAry: [],     // 總(累計)委買口數
            totalPreSellSizeAry: [],    // 總(累計)委賣口數
            totalPreBuyContractAry: [], // 總(累計)委買筆數
            totalPreSellContractAry: [],// 總(累計)委賣筆數
            totalBuySizeAry: [],        // 內盤成交量   
            totalSellSizeAry: []        // 外盤成交量
        }
    }
}

function updateDailyData(sec, callback) {

    const excelPath = 'D:/1NodeJS/FuturesRedictiveSystem/assets/source.xlsm';

    // 取得 DDE 資料並放入 dataStore 中
    dataStore['FITX_TEST'] = getTestData();
    callback( Object.assign({}, dataStore) );
    return;
    
    setInterval( () => {
        
        let data = ApiBackend.readExcel(excelPath);
        
        if(!data) return;

        let headerAry = data['header'];
        let rowData = data['rowData'][0];
        let no = rowData[0];
        let dailyData = dataStore[no];

        if(!dailyData) {
            dailyData = Object.assign({}, dataStore['DataName']);
        }

        let time = null;  // 時間
        let index = null; // 成交
        let totalPreBuySize = null;      // 總(累計)委買口數
        let totalPreSellSize = null;     // 總(累計)委賣口數
        let totalPreBuyContract = null;  // 總(累計)委買筆數
        let totalPreSellContract = null; // 總(累計)委賣筆數
        let totalBuySize = null;         // 內盤成交量   
        let totalSellSize = null;        // 外盤成交量

        headerAry.map( (header, i) => {

            let rowDataNow = rowData[i];

            switch(header) {
                case '商品':
                    dailyData.name = rowDataNow;
                    break;
                case '交易日期':
                    dailyData.date = rowDataNow;
                    break;
                case '開盤':
                    dailyData.openingPrice = rowDataNow;
                    break;
                case '收盤':
                    dailyData.closingPrice = rowDataNow;
                    break;
                case '最高':
                    dailyData.dayHighPrice = rowDataNow;
                    break;
                case '最低':
                    dailyData.dayLowPrice = rowDataNow;
                    break;

                case '時間':
                    time = rowDataNow;
                    break;
                case '成交':
                    index = rowDataNow;
                    break;
                case '累計委買(全)':
                    totalPreBuySize = rowDataNow;
                    break;
                case '累計委賣(全)':
                    totalPreSellSize = rowDataNow;
                    break;
                case '累委買筆(全)':
                    totalPreBuyContract = rowDataNow;
                    break;
                case '累委賣筆(全)':
                    totalPreSellContract = rowDataNow;
                    break;
            }

        })

        let timeAryLast = dailyData.metrics.timeAry[dailyData.metrics.timeAry.length-1];

        if(timeAryLast!=time) {
        // if(1) {
            dailyData.metrics.timeAry.push(time);
            dailyData.metrics.indexAry.push(index);
            dailyData.metrics.totalPreBuySizeAry.push(totalPreBuySize);
            dailyData.metrics.totalPreSellSizeAry.push(totalPreSellSize);
            dailyData.metrics.totalPreBuyContractAry.push(totalPreBuyContract);
            dailyData.metrics.totalPreSellContractAry.push(totalPreSellContract);
            dailyData.metrics.totalBuySizeAry.push(totalBuySize);
            dailyData.metrics.totalSellSizeAry.push(totalSellSize);
        }

        dataStore[no] = dailyData;

        callback( Object.assign({}, dataStore) );
    }, sec*1000)
    
}

function getDaliyData(indexName, date) {

    return dataStore[indexName];
}

/**
 * 取得開盤到收盤的所有時間字串
 * @param { string } openingTime 開盤時間
 * @param { string } closingTime 收盤時間
 * @param { number } secSpace 秒數間隔
 */
function getAllDayTime(openingTime, closingTime, secSpace) {
    
    let timeAry = [];
    const date = '2018-5-17';
    
    let openingMs = Date.parse(`${date} ${openingTime}`);
    let closingMs = Date.parse(`${date} ${closingTime}`);
    let spaceSize = (closingMs-openingMs) / (secSpace*1000);
    
    for(let i=0; i<=spaceSize; i++) {
        let time = _msToHM(openingMs + secSpace*1000*i);
        timeAry.push(time);
    }
    
    return timeAry;
}

/**
 * 將 milliseconds 轉換成 24時:分，異常時間則回傳空字串
 * @param { number } ms 毫秒
 */
function _msToHM(ms) {
    
    let splitAry = (new Date(ms).toLocaleTimeString('zh', {hour12: false})).split(':');

    if(splitAry.length < 2) return '';

    return splitAry[0].match(/\d+/g) + ':' + splitAry[1];
    // return splitAry[0].match(/\d+/g) + ':' + splitAry[1] + ':' + splitAry[2]; // 含秒數
}

/**
 * 
 * @param { array } originalTimeAry 原始時間陣列
 * @param { array } metricsAry 指標陣列
 * @param { array } showTimeAry 要顯示的Y軸時間
 */
function getMetricsAryWithTime(originalTimeAry, metricsAry, showTimeAry) {

    if(!showTimeAry) return metricsAry;

    // 複製 Array
    originalTimeAry = originalTimeAry.slice();
    metricsAry = metricsAry.slice();
    showTimeAry = showTimeAry.slice();

    let metricsAryNew = [];

    showTimeAry.map( (showTime) => {
        
        let find = false;

        for(let i=0; i<originalTimeAry.length; i++) {
            let origiTime = originalTimeAry[i];
            
            if(!origiTime) continue;

            if(origiTime.indexOf(showTime) > -1) {
                
                metricsAryNew.push(metricsAry[i]);

                // 清除比對過的item
                originalTimeAry.splice(i, 1);
                metricsAry.splice(i, 1);

                find = true;
                break;
            } 
        }

        if(!find) metricsAryNew.push(null);

    })

    return metricsAryNew;

}

/**
 * 
 * @param {*} indexName 指數名稱
 * @param {*} metricsName 指標名稱
 * @param {*} showTimeAry 要取代預設的時間
 */
function getMetrics(indexName, metricsName, showTimeAry) {

    let data = getDaliyData(indexName);
    let timeAry = data.metrics.timeAry;
    let metricsAry = [];

    switch(metricsName) {
        case 'time':
            metricsAry = data.metrics.timeAry;
            break;
        case 'index':
            metricsAry = data.metrics.indexAry;
            break;
        case 'totalPreBuySize':
            metricsAry = data.metrics.totalPreBuySizeAry;
            break;
        case 'totalPreSellSize':
            metricsAry = data.metrics.totalPreSellSizeAry;
            break;
        case 'totalPreBuyContract':
            metricsAry = data.metrics.totalPreBuyContractAry;
            break;
        case 'totalPreSellContract':
            metricsAry = data.metrics.totalPreSellContractAry;
            break;
        case 'totalBuySize':
            metricsAry = data.metrics.totalBuySizeAry;
            break;
        case 'totalSellSize':
            metricsAry = data.metrics.totalSellSizeAry;
            break;
    }

    if(!showTimeAry) return metricsAry;
    
}

function getTestData() {
    return {
        name: '台指期_測試', // 指數名稱
        date: '2018/06/13',    // 日期
        openingPrice: 10938,   // 開盤價
        closingPrice: 10952,   // 收盤價
        dayHighPrice: 10970,   // 目前(當天)最高價
        dayLowPrice: 10908,    // 目前(當天)最低價
        openingTime: '08:45:00',  // 開盤時間
        closingTime: '13:45:00',  // 收盤時間
        metrics: {                // 每個陣列大小應為一致，無資料應給空值
            timeAry: ['08:45:00','08:50:00','09:15:00','09:45:00','10:15:00','10:45:00','11:15:00','11:45:00','12:15:00','13:15:00'],
            indexAry: [10950, 10955, 10960, 10970, 10955, 10941, 10963, 10941, 10920, 10930],               
            totalPreBuySizeAry: [1000, 1100, 1200, 1500, 1300, 1400, 1000, 850, 800, 900],
            totalPreSellSizeAry: [800, 1100, 1000, 850, 1100, 1000, 1200, 1300, 1500, 1400],
            totalPreBuyContractAry: [450, 500, 550, 650, 400, 350, 500, 600, 750, 800], 
            totalPreSellContractAry: [550, 500, 450, 650, 700, 600, 750, 850, 950, 800],
            totalBuySizeAry: [450, 500, 550, 650, 400, 350, 500, 600, 750, 700],
            totalSellSizeAry: [550, 500, 450, 650, 700, 600, 750, 850, 950, 800]
        }
    }
}