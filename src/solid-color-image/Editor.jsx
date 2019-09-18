import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Color as LibColor} from '@nti/lib-commons';
import {Input, Text} from '@nti/web-commons';

import Styles from './Editor.css';

const {Color} = Input;
const cx = classnames.bind(Styles);
const t = scoped('nti-whiteboard.solid-color-image.Editor', {
	presets: 'Presets'
});

const Presets = [
	{color: LibColor.fromHex('#D10615')},
	{color: LibColor.fromHex('#F6A807')},
	{color: LibColor.fromHex('#F7EA00')},
	{color: LibColor.fromHex('#7AD500')},
	{color: LibColor.fromHex('#3F7600')},
	{color: LibColor.fromHex('#BF00E3')},
	{color: LibColor.fromHex('#9300FF')},
	{color: LibColor.fromHex('#4B8DE4')},
	{color: LibColor.fromHex('#49E4C1')},
	{color: LibColor.fromHex('#B6EB82')},
	{color: LibColor.fromHex('#8C5827')},
	{color: LibColor.fromHex('#8C5827')},
	{color: LibColor.fromHex('#000000')},
	{color: LibColor.fromHex('#4A4A4A')},
	{color: LibColor.fromHex('#9B9B9B')},
	{color: LibColor.fromHex('#FFFFFF')},
];

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
				<div className={cx('container')}>
					<Color.Hue value={color} onChange={this.onChange} />
					<Color.Text className={cx('text-input')} value={color} onChange={this.onChange} />
					<Text.Base className={cx('preset-label')}>{t('presets')}</Text.Base>
					<Color.PresetSwatches swatches={Presets} selected={color} onSelect={this.onChange} />
				</div>
			</div>
		);
	}
}
