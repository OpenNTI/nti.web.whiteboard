import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Input} from '@nti/web-commons';

import Styles from './Editor.css';

const {Color} = Input;
const cx = classnames.bind(Styles);

export default class SolidColorEditor extends React.Component {
	static propTypes = {
		value: PropTypes.shape({
			color: PropTypes.object
		}),
		onChange: PropTypes.func
	}

	onChange = (color) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange({color});
		}
	}

	render () {
		const {value} = this.props;
		const {color} = value || {};

		return (
			<div className={cx('solid-color-editor')}>
				<Color.SaturationBrightness value={color} onChange={this.onChange} />
				<Color.Hue value={color} onChange={this.onChange} />
			</div>
		);
	}
}
