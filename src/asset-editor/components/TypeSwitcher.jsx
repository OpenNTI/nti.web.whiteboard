import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {getIDForEditor, getButtonForEditor} from '../types';

import Styles from './TypeSwitcher.css';

const cx = classnames.bind(Styles);

AssetEditorTypeSwitcher.propTypes = {
	editors: PropTypes.array,
	current: PropTypes.string,
	setCurrent: PropTypes.string
};
export default function AssetEditorTypeSwitcher ({editors, current, setCurrent}) {
	return (
		<div className={cx('type-switcher')}>
			{editors.map((editor) => {
				const Button = getButtonForEditor(editor);
				const id = getIDForEditor(editor);

				if (!Button) { return null; }

				return (
					<Button key={id} current={current} setCurrent={setCurrent} />
				);
			})}
		</div>
	);
}