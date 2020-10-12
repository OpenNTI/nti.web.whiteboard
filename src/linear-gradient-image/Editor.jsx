import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Preview from './components/Preview';
import Stop from './components/Stop';

export default class LinearGradientEditor extends React.Component {

	static propTypes = {
		value: PropTypes.shape({
			rotation: PropTypes.string,
			stops: PropTypes.array
		}),
		onChange: PropTypes.func
	}

	state = {selectedStop: 0}

	selectStop = stop => this.setState({selectedStop: stop})

	updateSelectedStop = (stop) => {
		const {value, onChange} = this.props;
		const {selectedStop} = this.state;

		if (onChange) {
			onChange(
				{
					...value,
					stops: value.stops.map((s, i) => i === selectedStop ? stop : s)
				}
			);
		}
	}

	render () {
		const {value} = this.props;
		const {selectedStop} = this.state;
		const stops = value && value.stops;
		const selected = stops && stops[selectedStop];

		return (
			<div className={cx('solid-color-editor')}>
				<Preview stops={stops} selectStop={this.selectStop} selectedStop={selectedStop} />
				{selected && (
					<Stop stop={selected} onChange={this.updateSelectedStop} />
				)}
			</div>
		);
	}
}
