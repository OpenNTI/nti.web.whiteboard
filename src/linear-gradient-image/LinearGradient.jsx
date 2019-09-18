import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@nti/web-commons';

import style from './LinearGradient.css';

const { Color } = Input;

const defaultColors = [
	{ stopcolor: '#ffffff' },
	{ stopcolor: '#000000' },
];

export default class LinearGradientInput extends Component {

	static propTypes = {
		value: PropTypes.shape({
			color: PropTypes.object
		}),
		onChange: PropTypes.func
	}

	state = {
		currentStop: null,
	}

	gradient(stops) {
		return {
			WebkitAppearance: 'none',
			backgroundImage: `linear-gradient(to right, ${stops[0].stopcolor}, ${stops[1].stopcolor}`,
			width: '100vm',
			height: '14px',
			borderRadius: '30px',
			marginLeft: '5px',
			marginRight: '5px',
			marginTop: '15px',
			marginBottom: '10px',
		};
	}

	onClick = (stop) => {
		this.setState({currentStop: stop});
		console.log(stop.stopcolor);
	}

	render() {

		const stops = this.props.stops || defaultColors;

		return (
			<div style={this.gradient(stops)} className={style.parent}>
				<Color.Thumb className={style.leftThumb} />
				<Color.Thumb className={style.rightThumb} />
			</div>
		);
	}
}
