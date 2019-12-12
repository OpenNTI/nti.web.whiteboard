import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Color} from '@nti/lib-commons';
import {scoped} from '@nti/lib-locale';

import * as SolidColorImage from '../../../solid-color-image';
import TypeButton from '../../components/TypeButton';
import {getSVGBlob} from '../utils';

import Styles from './View.css';

const ID = 'solid-color';
const cx = classnames.bind(Styles);
const t = scoped('nti-web-whiteboard.asset-editor.types.solid-color.View', {
	name: 'Solid'
});

const FileName = 'background.svg';
const DefaultColor = {
	color: Color.fromHex('#3fb3f6')
};

function Button (props) {
	return (
		<TypeButton
			{...props}
			id={ID}
			label={t('name')}
			iconClassName={cx('solid-color-icon')}
			activeIconClassName={cx('solid-color-icon-active')}
		/>
	);
}

AssetSolidColorEditor.id = ID;
AssetSolidColorEditor.Button = Button;
AssetSolidColorEditor.getStateForAsset = (url, raw) => {
	const original = SolidColorImage.getSolidColorStateFromSVG(raw);

	if (!original) { return null; }

	return {
		original,
		updated: null
	};
};
AssetSolidColorEditor.getPayload = async ({updated}, {aspectRatio}) => {
	const svg = SolidColorImage.getSVGFromSolidColorState(updated, aspectRatio);
	const blob = getSVGBlob(svg);

	blob.name = FileName;
	return blob;
};
AssetSolidColorEditor.propTypes = {
	value: PropTypes.shape({
		original: PropTypes.object,
		updated: PropTypes.object
	}),
	format: PropTypes.object,
	onChange: PropTypes.func
};
export default function AssetSolidColorEditor ({value, format, onChange}) {
	const {updated, original} = value || {};

	const onUpdate = (state) => {
		onChange({
			...value,
			updated: state
		});
	};

	return (
		<SolidColorImage.Editor value={updated || original || DefaultColor} onChange={onUpdate} />
	);
}