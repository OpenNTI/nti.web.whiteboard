import React from 'react';
import PropTypes from 'prop-types';
import {Input} from '@nti/web-commons';

StopEditor.propTypes = {
	stop: PropTypes.shape({
		color: PropTypes.object
	}),
	onChange: PropTypes.func
};
export default function StopEditor ({stop, onChange}) {
	const {color} = stop;
	const onColorChange = onChange ? (newColor => onChange({...stop, color: newColor})) : null;

	return (
		<div>
			<Input.Color.SaturationBrightness value={color} onChange={onColorChange} />
			<div>
				<Input.Color.Hue value={color} onChange={onColorChange} />
				<Input.Color.Text value={color} onChange={onColorChange} />
			</div>
		</div>
	);
}