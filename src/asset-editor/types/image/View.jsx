import React from 'react';
import {scoped} from '@nti/lib-locale';
import classnames from 'classnames/bind';

import TypeButton from '../../components/TypeButton';

import Styles from './View.css';

const ID = 'image';
const cx = classnames.bind(Styles);
const t = scoped('nti-web-whiteboard.asset-editor.types.image.View', {
	name: 'Image'
});

function Button (props) {
	return (
		<TypeButton
			{...props}
			id={ID}
			label={t('name')}
			iconClassName={cx('image-icon')}
			activeIconClassName={cx('image-icon-active')}
		/>
	);
}

AssetImageEditor.id = ID;
AssetImageEditor.Button = Button;
AssetImageEditor.getStateForAsset = (url) => {
	return {
		original: url,
		updated: null
	};
};
export default function AssetImageEditor () {
	return (
		<div>
			Asset Image Editor
		</div>
	);
}