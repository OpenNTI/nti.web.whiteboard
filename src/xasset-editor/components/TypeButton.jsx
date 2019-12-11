import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Button, Text} from '@nti/web-commons';

import Store from '../Store';

import Styles from './TypeButton.css';

const cx = classnames.bind(Styles);

export default
@Store.monitor(['current', 'setCurrent'])
class CommunityAssetEditorTypeButton extends React.Component {
	static propTypes = {
		name: PropTypes.string,
		label: PropTypes.string,
		iconClassName: PropTypes.string,
		activeIconClassName: PropTypes.string,

		current: PropTypes.string,
		setCurrent: PropTypes.func
	}

	onClick = (e) => {
		const {setCurrent, name} = this.props;

		if (setCurrent) {
			setCurrent(name);
		}
	}

	render () {
		const {name, label, iconClassName, activeIconClassName, current} = this.props;
		const active = current === name;

		return (
			<Button className={cx('type-button', {active})} title={label} onClick={this.onClick}>
				<div className={cx('icon', active ? activeIconClassName : iconClassName)} />
				<Text.Base className={cx('type-label')}>
					{label}
				</Text.Base>
			</Button>
		);
	}
}