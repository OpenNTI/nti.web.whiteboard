import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Errors} from '@nti/web-commons';

import Store from '../Store';
import {getForType} from '../types/Editor';

import Styles from './EditorBody.css';

const cx = classnames.bind(Styles);

export default
@Store.monitor(['current', 'values', 'setValue', 'error', 'format', 'aspectRatio'])
class CommunityAssetEditorBody extends React.Component {
	static propTypes = {
		current: PropTypes.string,
		values: PropTypes.object,
		setValue: PropTypes.func,
		error: PropTypes.any,
		format: PropTypes.any,
		aspectRatio: PropTypes.number
	}

	onChange = (value) => {
		const {current, setValue} = this.props;

		if (setValue) {
			setValue(current, value);
		}
	}

	render () {
		const {current, values, error, format, aspectRatio} = this.props;
		const Cmp = getForType(current);

		return (
			<div className={cx('community-asset-editor-body')}>
				{current && Cmp && (
					<Cmp
						value={values[current]}
						onChange={this.onChange}
						error={error}
						format={format}
						aspectRatio={aspectRatio}
					/>
				)}
				{error && (<Errors.Message error={error} />)}
			</div>
		);
	}
}