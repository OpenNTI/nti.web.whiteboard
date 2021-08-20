import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Blur, Crop, Rotate, Darken } from '../tools';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

const Tools = [Blur, Darken, Crop, Rotate];
const Controls = Tools.map(t => t.Control).filter(Boolean);

ImageEditorToolbar.Controls = Controls.reduce(
	(acc, t) => ({ ...acc, [t.Name]: t.Name }),
	{}
);
ImageEditorToolbar.propTypes = {
	allowedControls: PropTypes.array,
};
export default function ImageEditorToolbar({ allowedControls, ...otherProps }) {
	if (!allowedControls?.length) {
		return null;
	}

	const allowedNames = new Set(allowedControls);
	const controls = Controls.filter(t => allowedNames.has(t.Name));

	return (
		<div className={cx('image-editor-tool-bar')}>
			{controls.map(Control => (
				<Control key={Control.name} {...otherProps} />
			))}
		</div>
	);
}
