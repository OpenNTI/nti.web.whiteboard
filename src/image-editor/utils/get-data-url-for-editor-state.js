import getCanvasForEditorState from './get-canvas-for-editor-state';

export default function getDataURLForEditorState (editorState) {
	const canvas = getCanvasForEditorState(editorState);

	if (!canvas) { throw new Error('Unable to get data url.'); }

	return canvas.toDataURL();
}