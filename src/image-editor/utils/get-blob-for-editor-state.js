import getCanvasForEditorState from './get-canvas-for-editor-state';

export default function getBlobForEditorState (editorState) {
	const canvas = getCanvasForEditorState(editorState);

	if (!canvas) { return Promise.reject(); }

	return new Promise((fulfill) => {
		canvas.toBlob((blob) => {
			blob.name = editorState.filename;
			fulfill(blob);
		});
	});
}
