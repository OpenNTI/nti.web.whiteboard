import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Color } from '@nti/lib-commons';
import { Input } from '@nti/web-commons';

import Control from '../../../tool-bar/Control';

const t = scoped('nti-web-whiteboard.image-editor.tools.darken.control.View', {
	label: 'Darken',
});

function getDarkenOpacity(editorState) {
	return (
		editorState &&
		editorState.formatting &&
		editorState.formatting.darken &&
		editorState.formatting.darken.opacity
	);
}

function getDarkenColor(editorState) {
	return (
		editorState &&
		editorState.formatting &&
		editorState.formatting.darken &&
		editorState.formatting.darken.color
	);
}

function setDarkenOpacity(editorState, opacity) {
	return {
		...(editorState || {}),
		formatting: {
			...((editorState && editorState.formatting) || {}),
			darken: {
				...((editorState &&
					editorState.formatting &&
					editorState.formatting.darken) ||
					{}),
				opacity,
			},
		},
	};
}

function setDarkenColor(editorState, color) {
	return {
		...(editorState || {}),
		formatting: {
			...((editorState && editorState.formatting) || {}),
			darken: {
				...((editorState &&
					editorState.formatting &&
					editorState.formatting.darken) ||
					{}),
				color,
			},
		},
	};
}

DarkenControl.Name = 'Darken';
DarkenControl.propTypes = {
	editorState: PropTypes.object,
	setEditorState: PropTypes.func,
};
export default function DarkenControl({ editorState, setEditorState }) {
	const opacity = getDarkenOpacity(editorState) || 0;
	const color = getDarkenColor(editorState) || '#fff';

	const onOpacityChange = value => {
		setEditorState(setDarkenOpacity(editorState, value / 100));
	};

	const onColorChange = value => {
		setEditorState(setDarkenColor(editorState, value));
	};

	return (
		<Control label={t('label')}>
			<Input.Color.Flyout
				value={Color(color)}
				onChange={onColorChange}
				arrow
			/>
			<Input.Range
				value={opacity * 100}
				min={0}
				max={100}
				onChange={onOpacityChange}
			/>
		</Control>
	);
}
