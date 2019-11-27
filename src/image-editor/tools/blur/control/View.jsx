import React from 'react';
import PropTypes from 'prop-types';

function getBlurRadius (editorState) {
	return editorState && editorState.formatting && editorState.formatting.blur && editorState.formatting.blur.radius;
}

function setBlurRadius (editorState, blur) {
	const radius = isNaN(blur) ? null : parseInt(blur, 10);

	return {
		...editorState,
		formatting: {
			...editorState.formatting,
			blur: {
				...editorState.blur,
				radius: radius
			}
		}
	};
}


BlurControl.Name = 'Blur';
BlurControl.propTypes = {
	editorState: PropTypes.object,
	setEditorState: PropTypes.func
};
export default function BlurControl ({editorState, setEditorState}) {
	const radius = getBlurRadius(editorState);
	
	const onChange = (e) => {
		setEditorState(setBlurRadius(editorState, e.target.value));
	};

	return (
		<div>
			Blur Control
			<input type="range" min={0} max={50} value={radius || 0} onChange={onChange}/>
		</div>
	);
}