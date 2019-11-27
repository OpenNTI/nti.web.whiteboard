import React from 'react';
import PropTypes from 'prop-types';

function getDarkenOpacity (editorState) {
	return editorState && editorState.formatting && editorState.formatting.darken && editorState.formatting.darken.alpha;
}

function setDarkenOpacity (editorState, opacity) {
	return {
		...editorState,
		formatting: {
			...editorState.formatting,
			darken: {
				...editorState.darken,
				opacity
			}
		}
	};
}

const coerce = x => isNaN(x) ? null : parseInt(x, 10);

DarkenControl.Name = 'Darken';
DarkenControl.propTypes = {
	editorState: PropTypes.object,
	setEditorState: PropTypes.func
};
export default function DarkenControl ({editorState, setEditorState}) {
	const opacity = getDarkenOpacity(editorState) || 0;

	const onChange = (e) => {
		setEditorState(setDarkenOpacity(editorState, Math.round(coerce(e.target.value) / 100)));
	};

	return (
		<div>
			Darken Control
			<input type="range" min={0} max={100} value={opacity * 100} onChange={onChange} />
		</div>
	);
}