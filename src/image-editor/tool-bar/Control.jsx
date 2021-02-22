import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Text } from '@nti/web-commons';

import Styles from './Control.css';

const cx = classnames.bind(Styles);

Control.propTypes = {
	label: PropTypes.string,
	children: PropTypes.any,
};
export default function Control({ label, children }) {
	return (
		<div className={cx('control')}>
			<Text.Base className={cx('label')}>{label}</Text.Base>
			<div className={cx('inputs')}>{children}</div>
		</div>
	);
}
