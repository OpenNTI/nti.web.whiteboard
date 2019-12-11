import React from 'react';
import classnames from 'classnames/bind';

import Buttons from '../types/Buttons';

import Styles from './TypeSwitcher.css';

const cx = classnames.bind(Styles);

export default function CommunityAssetEditorTypeSwitcher () {
	return (
		<div className={cx('type-switcher')}>
			{
				Buttons
					.map((Button, index) => {
						if (!Button) { return null; }

						return (
							<Button key={index} />
						);
					})
			}
		</div>
	);
}