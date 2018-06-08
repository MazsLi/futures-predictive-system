import Immutable from 'immutable';
import React from 'react';
import Data from '../../apis/data';
import ChartBase from './ChartBase';
import ApiBackend from '../../apis/backend';
const debug = require('debug')('dashboard');

class Dashboard extends React.PureComponent {

	constructor(props, context) {
		super(props, context);

		this.state = {
			columnWidth: 'eight',
			chartAry: [],
		}

	}

	componentWillMount = () => {
		
		
	}

	componentDidMount = () => {

		Data.updateDailyData(5, (dataStore) => {
			
			// this.updateChart(dataStore['FITX06']);
			this.updateChart(dataStore['FITX_TEST']);
		});
		
	}

	updateChart = (dailyData) => {
		
		let timeAry = dailyData.metrics.timeAry;
		let indexAry = dailyData.metrics.indexAry;

		let allTime = Data.getAllDayTime('08:45:00', '13:45:00', 5);
		let newIndexAry = Data.getMetricsAryWithTime(timeAry, indexAry, allTime);
		
		// 指數
		let chartIndexData = {
			title: dailyData.name,
			labels: timeAry,
			data: indexAry,
		}

		// 口差
		let preSizeDiffAry = [];

		// 取得口差(總委買口數-總委賣口數)
		dailyData.metrics.totalPreBuySizeAry.map( (preBuy, i) => {
			preSizeDiffAry.push( preBuy - dailyData.metrics.totalPreSellSizeAry[i] );
		})

		let preSizeDiffData = {
			title: '口差',
			labels: timeAry,
			data: preSizeDiffAry,
		}

		this.setState((prevState, props) => ({
			chartAry: [
				<ChartBase chartType="line" chartData={ Immutable.fromJS(chartIndexData) }/>,
				// <ChartBase chartType="line-area" chartData={ Immutable.fromJS(preSizeDiffData) }/>
			]
		}))

	}

	render() {

		if(this.state.chartAry.length > 0) {

			debug('render...');

			let contentAry = [];
			let columnStyle = {
				padding: 10,
				height: ApiBackend.window.getWindowHeight()/2 + 'px',
			}
			
			debug('window height:' + columnStyle.height);

			this.state.chartAry.map( (chart, i) => {
				contentAry.push(
					<div key={i} style={columnStyle} className={this.state.columnWidth + ' wide column'}>
						{chart}
					</div>
				)
			})

			let containerStyle = {
				padding: 10
			}

			return (
				<div style={containerStyle} className='ui grid'>
					{contentAry}
				</div>
			)
		}
	
		return null;
	}
}

export default Dashboard;