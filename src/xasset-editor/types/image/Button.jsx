import React from 'react';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';

import TypeButton from '../../components/TypeButton';

import Styles from './Button.css';
import {Name} from './Constants';

const cx = classnames.bind(Styles);
const t = scoped('nti-profiles.community.asset-editor.types.image', {
	label: 'Image'
});

export default function ImageButton () {
	return (
		<TypeButton
			name={Name}
			label={t('label')}
			iconClassName={cx('image-icon')}
			activeIconClassName={cx('image-icon-active')}
		/>
	);
}