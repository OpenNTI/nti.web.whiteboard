import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Loading} from '@nti/web-commons';

import Store from './Store';
import Style from './View.css';
import Controls from './components/Controls';
import EditorBody from './components/EditorBody';
import TypeSwitcher from './components/TypeSwitcher';

const cx = classnames.bind(Style);

export default
@Store.connect(['loading', 'saving', 'save'])
class CommunityAssetEditor extends React.Component {
	static syncAssets = Store.syncAssets

	static deriveBindingFromProps (props) {
		return {
			assetURL: props.assetURL,
			aspectRatio: props.aspectRatio,
			format: props.format,

			onSave: props.onSave,
			onCancel: props.onCancel
		};
	}

	static propTypes = {
		assetURL: PropTypes.string,
		aspectRatio: PropTypes.number,
		format: PropTypes.object,

		onSave: PropTypes.func,
		onCancel: PropTypes.func,

		loading: PropTypes.bool,
		saving: PropTypes.bool,
		save: PropTypes.func
	}

	onSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const {save} = this.props;

		if (save) {
			save();
		}
	}


	render () {
		const {loading} = this.props;

		return (
			<div className={cx('community-asset-editor')}>
				<Loading.Placeholder loading={loading} fallback={(<Loading.Spinner />)}>
					<div className={cx('navigation')}>
						<TypeSwitcher />
					</div>
					<form className={cx('body')} onSubmit={this.onSubmit}>
						<EditorBody />
						<Controls />
					</form>
				</Loading.Placeholder>
			</div>
		);
	}
}