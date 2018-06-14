
Futures Predictive System (期貨預判系統)

完成度(...1%)

# 緣由
因為我很喜歡玩股票期權，偶然看到教學可以用盤中一些交易訊息來判斷目前多空氣氛，看了一下市面軟體的價格，嗯...那就自幹看看吧。

# 流程
1. 資料需要哪些
2. 資料怎麼來
3. 資料怎麼讀取
4. 資料怎麼顯示

# 資料需要哪些
這邊資料的定義，是以網路上所搜尋到的資料，以委買賣或是口數的差異來觀察即時的盤勢能量。

[均差-代表大戶與散戶的掛單狀況]
均買張數=總委買口數/總委買筆數
均賣張數=總委賣口數/總委賣筆數
均差 = 均買張數 - 均賣張數
均差 > 0.2 時，盤勢偏多；
均差 < -0.2時，盤勢偏空

[口差-代表市場上多空觀望的氣氛]
委買委賣差=總委買口數-總委賣口數
口差大於 +2000 口時，盤勢偏多
低於 -2000 口時，盤勢偏空

[筆差-代表市場已成交的多空力道]
筆差=內盤成交量-外盤成交量
筆差 > +1500，盤勢偏多；筆差 > -1500，盤勢偏空
筆差 > +3000，多方趨勢盤；筆差 < -3000，空方趨勢盤

額外資訊:
MasterForce主力指標: 利用即時委買、委賣量的差值換算出的籌碼動向，這些資訊被解讀為大戶(或主力)的動向，被認為具有領先特性。
SlaveForce散戶指標: 利用即時多空委買賣的筆數差值，計算出小單交易的狀況，此資訊常被認為是用來判斷散戶的動態，當行情呈現趨勢盤時，容易與趨勢反向，具有反指標意義；但在量縮盤整的時候，則不一定。
TWSEForce氣氛指標: 利用即時的大盤漲跌家數差值變化，可以看出目前現貨的狀況，如果是強多格局，大盤漲的家數會大勝跌的家數，此時漲勢具有延續性。
DealtForce成交力差指標：利用即時多空單累計成交量的差值，計算出實際的成交力道，此資訊常被用來判斷行情的確立或是走勢延續。

# 資料怎麼來
首先我需要即時的取得委買委賣的資訊，我目前的作法比較笨，是透過免費的看盤軟體。  
這軟體必須要提供即時委買賣，以及匯出 Excel。
後來選擇下載免費的[XQ操盤高手](http://www.xq.com.tw/XQlite-Download.aspx)，它裡面可以設定匯出指定欄位的Excel，Excel裡面也會即時去連動到程式透過 DDE、RTD 去撈資料。  

# 資料怎麼讀取
因為我資料的來源檔是 Excel，所以我需要能夠讀取 Excel 的 JS 套件。  
這邊我利用的是 [exceljs](https://github.com/guyonroche/exceljs)，但這邊如果 Excel 改成匯出 CSV 的話，也可以不需要這個套件，直接用 NodeJS 的 FileSystem 來去讀檔就可以。

這邊還有一個問題是實作時發現到的，Excel 雖然會更新，但是不會存檔所以這邊在excel內加入了一點VBA，簡單的讓它依照指定時間自動存檔，不然會發生套件抓不到的問題。

# 資料怎麼顯示
這邊我們用的是 [Echarts](http://echarts.baidu.com/option.html#title) 這個 JS 的 Library。  
儀錶板 - 可以加入各種指數走勢指標圖
預判模式 - 根據各種指標，直接判斷買賣點
訓練模式 - 根據各種指標，直接判斷買賣點，並預成交後觀察績效

[圖形類型]
指數走勢圖
指數K線圖

# 用了哪些Library
[圖表 - Echarts](http://echarts.baidu.com/option.html#title)  
[元件設計 - Material-UI](https://github.com/mui-org/material-ui)