import getCanvasForEditorState from './get-canvas-for-editor-state';

export default function getDataURLForEditorState(editorState, outputSize) {
	const canvas = getCanvasForEditorState(editorState, outputSize);

	if (!canvas) {
		throw new Error('Unable to get data url.');
	}

	return canvas.toDataURL();
}
