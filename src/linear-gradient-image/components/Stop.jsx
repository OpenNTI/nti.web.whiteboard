import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Input } from '@nti/web-commons';

import Styles from './Stop.css';

const cx = classnames.bind(Styles);

StopEditor.propTypes = {
	stop: PropTypes.shape({
		color: PropTypes.object,
	}),
	onChange: PropTypes.func,
};
export default function StopEditor({ stop, onChange }) {
	const { color } = stop;
	const onColorChange = onChange
		? newColor => onChange({ ...stop, color: newColor })
		: null;

	return (
		<div className={cx('stop-editor')}>
			<Input.Color.SaturationBrightness
				value={color}
				onChange={onColorChange}
			/>
			<div className={cx('container')}>
				<Input.Color.Hue value={color} onChange={onColorChange} />
				<Input.Color.Text
					className={cx('text-input')}
					value={color}
					onChange={onColorChange}
				/>
			</div>
		</div>
	);
}
