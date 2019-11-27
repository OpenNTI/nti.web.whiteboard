import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {DialogButtons} from '@nti/web-commons';

import Store from '../Store';

const t = scoped('nti-profiles.community.asset-editor.components.Controls', {
	save: 'Save',
	cancel: 'Cancel'
});

export default
@Store.monitor(['saving', 'cancel', 'current', 'values'])
class CommunitAssetEditorControls extends React.Component {
	static propTypes = {
		saving: PropTypes.bool,
		cancel: PropTypes.func,
		current: PropTypes.string,
		values: PropTypes.object
	}

	get hasUpdated () {
		const {values, current} = this.props;

		return values && values[current] && values[current].updated;
	}

	render () {
		const {hasUpdated} = this;
		const {saving, cancel} = this.props;
		const buttons = [
			{label: t('cancel'), type: 'button', onClick: cancel, disabled: saving},
			{label: t('save'), type: 'submit', disabled: saving || !hasUpdated}
		];

		return (
			<DialogButtons flat buttons={buttons} />
		);
	}
}

