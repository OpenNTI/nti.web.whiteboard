import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {DialogButtons} from '@nti/web-commons';

const t = scoped('nti-web-whiteboard.asset-editor.components.Controls', {
	save: 'Save',
	cancel: 'Cancel'
});

AssetEditorControls.propTypes = {
	values: PropTypes.object,
	current: PropTypes.string,
	save: PropTypes.func,
	saving: PropTypes.bool,
	cancel: PropTypes.func
};
export default function AssetEditorControls ({values, current, cancel, saving}) {
	const hasUpdated = values && values[current] && values[current].updated;
	const buttons = [
		{label: t('cancel'), type: 'button', onClick: cancel, disabled: saving},
		{label: t('save'), type: 'submit', disabled: saving || !hasUpdated}
	];

	return (
		<DialogButtons flat buttons={buttons} />
	);
}
