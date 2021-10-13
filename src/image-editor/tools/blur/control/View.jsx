import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Input } from '@nti/web-commons';

import Control from '../../../tool-bar/Control';

const t = scoped('nti-web-whiteboard.image-editor.tools.blur.control.View', {
	label: 'Blur',
});

function getBlurRadius(editorState) {
	return (
		editorState &&
		editorState.formatting &&
		editorState.formatting.blur &&
		editorState.formatting.blur.radius
	);
}

function setBlurRadius(editorState, radius) {
	return {
		...(editorState || {}),
		formatting: {
			...((editorState && editorState.formatting) || {}),
			blur: {
				...((editorState &&
					editorState.formatting &&
					editorState.formatting.blur) ||
					{}),
				radius,
			},
		},
	};
}

BlurControl.Name = 'Blur';
BlurControl.propTypes = {
	editorState: PropTypes.object,
	setEditorState: PropTypes.func,
};
export default function BlurControl({ editorState, setEditorState }) {
	const radius = getBlurRadius(editorState);

	const onChange = value => {
		setEditorState(setBlurRadius(editorState, value));
	};

	return (
		<Control label={t('label')}>
			<Input.Range value={radius} min={0} max={50} onChange={onChange} />
		</Control>
	);
}
