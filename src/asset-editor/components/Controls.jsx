import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { DialogButtons } from '@nti/web-commons';

import { getHasUpdateForEditor, getEditorByID } from '../types';

const t = scoped('nti-web-whiteboard.asset-editor.components.Controls', {
	save: 'Save',
	cancel: 'Cancel',
});

AssetEditorControls.propTypes = {
	values: PropTypes.object,
	current: PropTypes.string,
	save: PropTypes.func,
	saving: PropTypes.bool,
	cancel: PropTypes.func,
	editors: PropTypes.array,
};
export default function AssetEditorControls({
	values,
	current,
	cancel,
	saving,
	editors,
}) {
	const editor = current && getEditorByID(editors, current);
	const hasUpdated = editor && getHasUpdateForEditor(editor, values[current]);

	const buttons = [
		{
			label: t('cancel'),
			type: 'button',
			onClick: cancel,
			disabled: saving,
		},
		{ label: t('save'), type: 'submit', disabled: saving || !hasUpdated },
	];

	return <DialogButtons flat buttons={buttons} />;
}
