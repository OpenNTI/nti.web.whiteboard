import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { scoped } from '@nti/lib-locale';
import { Color as LibColor } from '@nti/lib-commons';
import { Input, Text } from '@nti/web-commons';

import Styles from './Editor.css';

const { Color } = Input;
const cx = classnames.bind(Styles);
const t = scoped('nti-whiteboard.solid-color-image.Editor', {
	presets: 'Presets',
	red: 'Red',
	orange: 'Orange',
	yellow: 'Yellow',
	lightGreen: 'Light Green',
	darkGreen: 'Dark Green',
	lightPurple: 'Light Purple',
	darkPurple: 'Dark Purple',
	blue: 'Blue',
	cyan: 'Cyan',
	pastelGreen: 'Pastel Green',
	brown: 'Brown',
	blueGrey: 'Blue Grey',
	black: 'Black',
	darkGrey: 'Dark Grey',
	lightGrey: 'Light Grey',
	white: 'White',
});

const Presets = [
	{ color: LibColor.fromHex('#D10615'), title: t('red') },
	{ color: LibColor.fromHex('#F6A807'), title: t('orange') },
	{ color: LibColor.fromHex('#F7EA00'), title: t('yellow') },
	{ color: LibColor.fromHex('#7AD500'), title: t('lightGreen') },
	{ color: LibColor.fromHex('#3F7600'), title: t('darkGreen') },
	{ color: LibColor.fromHex('#BF00E3'), title: t('lightPurple') },
	{ color: LibColor.fromHex('#9300FF'), title: t('darkPurple') },
	{ color: LibColor.fromHex('#4B8DE4'), title: t('blue') },
	{ color: LibColor.fromHex('#49E4C1'), title: t('cyan') },
	{ color: LibColor.fromHex('#B6EB82'), title: t('pastelGreen') },
	{ color: LibColor.fromHex('#8C5827'), title: t('brown') },
	{ color: LibColor.fromHex('#575990'), title: t('blueGrey') },
	{ color: LibColor.fromHex('#000000'), title: t('black') },
	{ color: LibColor.fromHex('#4A4A4A'), title: t('darkGrey') },
	{ color: LibColor.fromHex('#9B9B9B'), title: t('lightGrey') },
	{ color: LibColor.fromHex('#FFFFFF'), title: t('white') },
];

export default class SolidColorEditor extends React.Component {
	static propTypes = {
		value: PropTypes.shape({
			color: PropTypes.object,
		}),
		onChange: PropTypes.func,
	};

	onChange = color => {
		const { onChange } = this.props;

		if (onChange) {
			onChange({ color });
		}
	};

	render() {
		const { value } = this.props;
		const { color } = value || {};

		return (
			<div className={cx('solid-color-editor')}>
				<Color.SaturationBrightness
					value={color}
					onChange={this.onChange}
				/>
				<div className={cx('container')}>
					<Color.Hue value={color} onChange={this.onChange} />
					<Color.Text
						className={cx('text-input')}
						value={color}
						onChange={this.onChange}
					/>
					<Text.Base className={cx('preset-label')}>
						{t('presets')}
					</Text.Base>
					<Color.PresetSwatches
						swatches={Presets}
						selected={color}
						onSelect={this.onChange}
					/>
				</div>
			</div>
		);
	}
}
