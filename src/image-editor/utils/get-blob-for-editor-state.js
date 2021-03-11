import getCanvasForEditorState from './get-canvas-for-editor-state';

export default async function getBlobForEditorState(editorState) {
	const canvas = getCanvasForEditorState(editorState);

	if (!canvas) {
		throw new Error('No Canvas');
	}

	return new Promise((fulfill, fail) => {
		try {
			canvas.toBlob(blob => {
				blob.name = editorState.filename;
				fulfill(blob);
			});
		} catch (e) {
			fail(e);
		}
	});
}
