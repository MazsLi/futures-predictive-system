import React from 'react';
import Echarts from 'echarts';
require('echarts/theme/purple-passion');
const debug = require('debug')('chart');

class ChartBase extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.state = {
			chartType: 'line',
			chartData: new Map([
				['title', null],
				['labels', []],
				['data', []]
			])
		}

	}

	componentWillMount = () => {
		
	}

	componentDidMount = () => {
		
		debug('componentDidMount...');
		debug(this.props.chartData);

		this.updateChart(this.props.chartData);
		
		this.setState((prevState, props) => ({
			chartType: props.chartType||'line',
			chartData: props.chartData
		}))
		
	}

	shouldComponentUpdate = (nextProps, nextState) => {

		if(!nextState.chartData || !this.state.chartData) return false;

		debug('shouldComponentUpdate...');
		debug('now data size:' + this.state.chartData.get('data').size);
		debug('next data size:' + nextState.chartData.get('data').size);

		if(nextState.chartData.get('data').size != this.state.chartData.get('data').size) {

			this.updateChart(nextProps.chartData);
			
			this.setState((prevState, props) => ({
				chartData: nextProps.chartData
			}))

			return true;
		}

		return false;
	}

	updateChart = (chartData) => {
		
		debug('updateChart...');

		// 初始化圖表
		let echarts = Echarts.init(this.refs.container, 'purple-passion');
		let _title = chartData.get('title');
		let _data = chartData.get('data').toArray();
		let _labels = chartData.get('labels').toArray();

		let option = {
			title : { // 標題
				text: _title, // 主標題
				// subtext: 'sub title' // 副標題
			},
			tooltip : { // 提示框
				trigger: 'axis', // 作用對象
				axisPointer: {
					type: 'cross' // 坐標軸顯示器類型(line、shadow、cross)
				}
			},
			legend: { // 數據標題(對應series名稱)
				data:['指數','成交量']
			},
			toolbox: { // 工具列
				show : false, // 是否要顯示工具列
				feature : { // 工具列的功能
					mark : {show: true}, // 輔助線
					dataView : {show: true, readOnly: false}, // 顯示圖表數據
					magicType : {show: true, type: ['line', 'bar']},// 動態類型切換
					restore : {show: true}, // 還原
					saveAsImage : {show: true}, // 另存為圖片
					brush : {show: true} // 選取工具
				}
			},
			xAxis : [ // X軸
				{
					type : 'category', // 預設類型(需有對應data)
					position: 'bottom', // X軸位置(default: bottom，top)
					// name: '時間', // X軸名稱
					// nameLocation: 'end', // X軸名稱顯示位置(start, center, end)
					// nameGap: 20, // 座標軸名稱與軸線之間的距離(default:15)
					axisLabel : {
						fontFamily: '微軟正黑體', // 標籤字型
					},
					data : _labels
				}
			],
			yAxis : [ // Y軸
				{
					type : 'value', // 適合用在連續數據
					name: '指數',
					position: 'left', // 指定位置
					max: Math.max(..._data) + 20, // 最大值
					min: Math.min(..._data) - 20, // 最小值
					interval: 10, // 刻度間隔
					axisLabel : {
						formatter: '{value} 點'
					}
				},
				{
					type: 'value',
					name: '成交量',
					position: 'right', // 指定位置
					min: 0,
					interval: 100,
					axisLabel: {
						formatter: '{value}'
					}
				}
			],
			series : [
				{
					name: '指數',
					type: 'line',
					data: _data,
					animationEasing: 'bounceOut',
					smooth: true, // 是否要平滑處理
					lineStyle: {
						// color: '#e098c7'
					},
					markPoint : { // 標示點
						symbol: 'circle', // 標示點樣式('circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow')
						symbolSize: 20, // 標示點大小
						data : [ // 要顯示的數據
							{type : 'max', name: '最高'},
							{type : 'min', name: '最低'}
						]
					},
					/*
					markLine : { // 標示線
						data : [ // 給一個值會成水平線，給兩個值會連成直線(兩個值需用陣列包)
							{
								name: '平均值',
								type: 'average' // min、max、average
							}
						]
					},
					markArea : { // 標示區域
						data : [
							[
								{
									name: '最小值到最大值',
									type: 'min'
								},
								{
									type: 'max'
								}
							]
						]
					}*/
				},
				{
					name: '成交量',
					type: 'bar',
					yAxisIndex: 1, // 指定第二個Y軸(default為0)
					data: [390,585,770,675,680,865,960,1145,950,1230]
				}
			]
		}

		// 設定選項
		echarts.setOption(option);
	}

	onChange = () => {

	}

	render() {
		
		debug('render...')

		if(this.state.chartData) {

			let containerStyle = {
				width: '100%',
				height: '100%'
			}

			return (
				<div ref='container' style={containerStyle} ></div>
			)
		}
		return null;
	}
}

export default ChartBase;
