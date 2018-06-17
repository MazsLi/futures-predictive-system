import Immutable from 'immutable';
import React from 'react';
import Data from '../../apis/data';
import ChartBase from './ChartBase';
import ApiBackend from '../../apis/backend';
const debug = require('debug')('dashboard');
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const styles = theme => ({
	root: {
		padding: 10,
	  	height: '100%',
	  	justifyContent: 'space-around',
	  	backgroundColor: theme.palette.background.dark,
	},
	gridList: {
	  	width: '100%',
	  	height: '100%',
	},
	gridListItem: {
		padding: 10,
	  },
	subheader: {
	  	width: '100%',
	},
});

class Dashboard extends React.PureComponent {

	state = {
		columnWidth: 'eight',
		chartAry: [],
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
				<ChartBase chartType="line-area" chartData={ Immutable.fromJS(preSizeDiffData) }/>
			]
		}))

	}

	render() {

		if(this.state.chartAry.length > 0) {

			debug('render...');

			const { classes } = this.props;
			let contentAry = [];

			this.state.chartAry.map( (chart, i) => {
				contentAry.push(
					<GridListTile className={classes.gridListItem} key={i} cols={1}>
						{chart}
					</GridListTile>
				)
			})

			return (
				<div className={classes.root}>
					<GridList 
						cellHeight={ApiBackend.window.getWindowHeight()/2} 
						className={classes.gridList} cols={2}>
						{contentAry}
					</GridList>
					
				</div>
			)
		}
	
		return null;
	}
}

export default withStyles(styles)(Dashboard);