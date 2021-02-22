import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Color } from '@nti/lib-commons';
import { Input } from '@nti/web-commons';

import Styles from './Preview.css';

const cx = classnames.bind(Styles);

function getGradientPreview(stops) {
	if (!stops || stops.length !== 2) {
		return null;
	}

	return {
		backgroundImage: `linear-gradient(to right, ${stops[0].color.hex.toString()}, ${stops[1].color.hex.toString()})`,
	};
}

function getStop(stops, index) {
	return (stops && stops[index]) || { color: Color.fromHex('#fff') };
}

export default class LinearGradientPreview extends React.Component {
	static propTypes = {
		stops: PropTypes.arrayOf(
			PropTypes.shape({
				color: PropTypes.shape({
					hex: PropTypes.shape({
						toString: PropTypes.func,
					}),
				}),
			})
		),
		selectedStop: PropTypes.number,
		selectStop: PropTypes.func,
	};

	select(stop) {
		const { selectStop } = this.props;

		if (selectStop) {
			selectStop(stop);
		}
	}

	selectFirst = () => this.select(0);
	selectSecond = () => this.select(1);

	render() {
		const { stops, selectedStop } = this.props;
		const gradient = getGradientPreview(stops);

		return (
			<div className={cx('gradient-preview')}>
				<div className={cx('preview')} style={gradient}>
					<Input.Color.Thumb
						className={cx('first-stop', {
							selected: selectedStop === 0,
						})}
						value={getStop(stops, 0).color}
						onClick={this.selectFirst}
					/>
					<Input.Color.Thumb
						className={cx('second-stop', {
							selected: selectedStop === 1,
						})}
						value={getStop(stops, 1).color}
						onClick={this.selectSecond}
					/>
				</div>
			</div>
		);
	}
}
