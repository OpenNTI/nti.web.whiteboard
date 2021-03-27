import getCanvasForEditorState from './get-canvas-for-editor-state';

export default async function getImageForEditorState(editorState, outputSize) {
	const canvas = getCanvasForEditorState(editorState, outputSize);

	if (!canvas) {
		throw new Error('No Canvas');
	}

	return new Promise((fulfill, reject) => {
		try {
			const img = new Image();

			img.onerror = reject;
			img.onload = () => {
				fulfill(img);
			};


			img.src = canvas.toDataURL();
		} catch (er) {
			reject(er);
		}
	});
}
