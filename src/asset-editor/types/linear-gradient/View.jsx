import React from 'react';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';

import * as LinearGradientImage from '../../../linear-gradient-image';
import TypeButton from '../../components/TypeButton';

import Styles from './View.css';

const ID = 'linear-gradient';
const cx = classnames.bind(Styles);
const t = scoped('nti-web-whiteboard.asset-editor.types.linear-gradient.View', {
	name: 'Gradient'
});

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
export default function AssetLinearGradientEditor () {
	return (
		<div>
			Asset Linear Gradient Editor
		</div>
	);
}