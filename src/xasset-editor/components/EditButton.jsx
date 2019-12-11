import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Button, Text} from '@nti/web-commons';

import Styles from './EditButton.css';

const cx = classnames.bind(Styles);
const t = scoped('nti-profiles.community.edit.inputs.EditButton', {
	edit: 'Edit'
});

EditButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func
};
export default function EditButton ({className, onClick}) {
	return (
		<Button className={cx('edit-asset-button', className)} onClick={onClick}>
			<i className={cx('icon-image', 'icon')} />
			<Text.Base className={cx('change')}>{t('edit')}</Text.Base>
		</Button>
	);
}