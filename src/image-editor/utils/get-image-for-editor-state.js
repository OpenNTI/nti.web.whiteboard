import getCanvasForEditorState from './get-canvas-for-editor-state';

export default function getImageForEditorState (editorState) {
	const canvas = getCanvasForEditorState(editorState);

	if (!canvas) { return Promise.reject(); }

	return new Promise((fulfill, reject) => {
		const img = new Image();

		img.onload = () => {
			fulfill(img);
		};

		img.src = canvas.toDataURL();
	});
}
