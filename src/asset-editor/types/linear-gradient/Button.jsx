import React from 'react';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';

import TypeButton from '../../components/TypeButton';

import Styles from './Button.css';
import {Name} from './Constant';

const cx = classnames.bind(Styles);
const t = scoped('nti-profiles.community.asset-editor.types.linear-gradient', {
	label: 'Gradient'
});

export default function ImageButton () {
	return (
		<TypeButton
			name={Name}
			label={t('label')}
			iconClassName={cx('linear-gradient-icon')}
			activeIconClassName={cx('linear-gradient-icon-active')}
		/>
	);
}
