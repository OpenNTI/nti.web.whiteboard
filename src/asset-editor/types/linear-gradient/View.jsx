import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Color} from '@nti/lib-commons';
import {scoped} from '@nti/lib-locale';

import * as LinearGradientImage from '../../../linear-gradient-image';
import TypeButton from '../../components/TypeButton';

import Styles from './View.css';

const ID = 'linear-gradient';
const cx = classnames.bind(Styles);
const t = scoped('nti-web-whiteboard.asset-editor.types.linear-gradient.View', {
	name: 'Gradient'
});

const DefaultGradient = {
	rotation: '-45',
	stops: [
		{color: Color.fromHex('#3fb3f6'), offset: '0%'},
		{color: Color.fromHex('#fff'), offset: '100%'}
	]
};

function Button (props) {
	return (
		<TypeButton
			{...props}
			id={ID}
			label={t('name')}
			iconClassName={cx('linear-gradient-icon')}
			activeIconClassName={cx('linear-gradient-icon-active')}
		/>
	);
}

AssetLinearGradientEditor.id = ID;
AssetLinearGradientEditor.Button = Button;
AssetLinearGradientEditor.getStateForAsset = (url, raw) => {
	const original = LinearGradientImage.getSVGToGradientObject(raw);

	if (!original) { return null; }

	return {
		original,
		updated: null
	};
};
AssetLinearGradientEditor.propTypes = {
	value: PropTypes.shape({
		original: PropTypes.object,
		updated: PropTypes.object
	}),
	format: PropTypes.object,
	onChange: PropTypes.func
};
export default function AssetLinearGradientEditor ({value, format, onChange}) {
	const {updated, original} = value || {};
	const onUpdate = (state) => {
		onChange({
			...value,
			updated: state
		});
	};

	return (
		<LinearGradientImage.Editor value={updated || original || DefaultGradient} onChange={onUpdate} />
	);
}