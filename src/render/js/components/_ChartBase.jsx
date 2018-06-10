import React from 'react';
const debug = require('debug')('chart');

const chartOption = {
	'line-area': {
		maintainAspectRatio: false,
		spanGaps: false,
		elements: {
			line: {
				tension: 0.4
			}
		},
		plugins: {
			filler: {
				propagate: false
			}
		},
		scales: {
			xAxes: [{
				ticks: {
					autoSkip: false,
					maxRotation: 0
				}
			}]
		}
	}
}

class ChartBase extends React.PureComponent {

	constructor(props, context) {
		super(props, context);

		this.state = {
			chartType: 'line',
			chartData: {
				title: null,
				labels: [],
				data: [],
			},
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

	componentWillReceiveProps(nextProps) {
		
		debug('componentWillReceiveProps...');
		debug('now data size:' + this.state.chartData.get('data').size);
		debug('next data size:' + nextProps.chartData.get('data').size);
		
		if(nextProps.chartData.get('data').size != this.state.chartData.get('data').size) {

			this.updateChart(nextProps.chartData);
			
			this.setState((prevState, props) => ({
				chartData: nextProps.chartData
			}))

		}

	}

	updateChart = (chartData) => {
		
		debug('updateChart...');

		let _labels = chartData.get('labels').toArray();
		let _data = chartData.get('data').toArray();
		let _title = chartData.get('title');
		let _option = chartOption[this.state.chartType];

		new Chart(this.refs.chart, {
			type: 'line',
			data: {
				labels: _labels,
				datasets: [
					{ 
						data: _data,
						label:_title,
						borderColor: '#3e95cd',
						// backgroundColor: '#EF233C',
						fill: (this.state.chartType!='line')? 'origin': false
					}
				]
			},
			options: Chart.helpers.merge(_option, {
				legend: {
					display: false, // 隱藏 data label
				},
				responsive: true,
				title: {
					display: true,
					fontFamily: '微軟正黑體',
					text: _title
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				}
			})
		})
	}

	onChange = () => {

	}

	render() {
		
		debug('render...')

		if(this.state.chartData) {

			let canvasStyle = {
				width: '100%',
				height: '100%'
			}

			return (
				<canvas ref='chart' style={canvasStyle} ></canvas>
			)
		}
		return null;
	}
}

export default ChartBase;
