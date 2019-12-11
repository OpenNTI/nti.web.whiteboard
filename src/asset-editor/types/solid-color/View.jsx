import React from 'react';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';

import * as SolidColorImage from '../../../solid-color-image';
import TypeButton from '../../components/TypeButton';

import Styles from './View.css';

const ID = 'solid-color';
const cx = classnames.bind(Styles);
const t = scoped('nti-web-whiteboard.asset-editor.types.solid-color.View', {
	name: 'Solid'
});

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

	if (!original) { return null;}
};
export default function AssetSolidColorEditor () {
	return (
		<div>
			Solid Color Editor
		</div>
	);
}