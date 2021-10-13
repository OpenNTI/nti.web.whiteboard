import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Text } from '@nti/web-commons';
import { Button } from "@nti/web-core";

import Styles from './TypeButton.css';

const cx = classnames.bind(Styles);

AssetEditorTypeButton.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	iconClassName: PropTypes.string,
	activeIconClassName: PropTypes.string,
	current: PropTypes.string,
	setCurrent: PropTypes.func,
};
export default function AssetEditorTypeButton({
	id,
	label,
	iconClassName,
	activeIconClassName,
	current,
	setCurrent,
}) {
	const active = current === id;

	const onClick = () => {
		if (setCurrent) {
			setCurrent(id);
		}
	};

	return (
		<Button
			className={cx('type-button', { active })}
			title={label}
			onClick={onClick}
		>
			<div
				className={cx(
					'icon',
					active ? activeIconClassName : iconClassName
				)}
			/>
			<Text.Base className={cx('type-label')}>{label}</Text.Base>
		</Button>
	);
}
