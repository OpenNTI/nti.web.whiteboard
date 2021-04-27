export function getFormatForEditor(editor) {
	return editor.props.format;
}

export function getOutputForEditor (editor) {
	return editor.props.output;
}

export function getStateForEditor(editor, url, raw) {
	return editor.type.getStateForAsset(url, raw, getFormatForEditor(editor), getOutputForEditor(editor));
}

export function getPayloadForEditor(editor, value) {
	return editor.type.getPayload(value, getFormatForEditor(editor), getOutputForEditor(editor));
}

export function getHasUpdateForEditor(editor, value) {
	if (editor?.type?.hasUpdate) {
		return editor.type.hasUpdate(value);
	}

	return Boolean(value?.updated);
}

export function getIDForEditor(editor) {
	return editor.type.id;
}

export function getButtonForEditor(editor) {
	return editor.type.Button;
}

export function getEditorByID(editors, id) {
	for (let editor of editors) {
		if (getIDForEditor(editor) === id) {
			return editor;
		}
	}
}

export function getSVGBlob(svg) {
	return new Blob([svg], { type: 'image/svg+xml' });
}
