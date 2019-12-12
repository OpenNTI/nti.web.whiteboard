import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Errors} from '@nti/web-commons';

import {getEditorByID} from '../types';

import Styles from './EditorBody.css';

const cx = classnames.bind(Styles);

AssetEditorBody.propTypes = {
	current: PropTypes.string,
	editors: PropTypes.array,
	values: PropTypes.object,
	setValues: PropTypes.func
};
export default function AssetEditorBody ({current, editors, values, setValues}) {
	const isError = values instanceof Error;
	const error = isError ? values : null;
	const Editor = current && getEditorByID(editors, current);

	const onChange = (value) => {
		if (setValues) {
			setValues({
				...values,
				[current]: value
			});
		}
	};

	return (
		<div className={cx('asset-editor-body')}>
			{!isError && Editor && React.cloneElement(Editor, {value: values[current], onChange})}
			{error && (<Errors.Message error={error} />)}
		</div>
	);
}