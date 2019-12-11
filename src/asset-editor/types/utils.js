export function getFormatForEditor (editor) {
	return editor.props.format;
}

export function getStateForEditor (editor, url, raw) {
	return editor.type.getStateForAsset(url, raw, getFormatForEditor(editor));
}

export function getIDForEditor (editor) {
	return editor.type.id;
}

export function getButtonForEditor (editor) {
	return editor.type.Button;
}

export function getEditorByID (editors, id) {
	for (let editor of editors) {
		if (getIDForEditor(editor) === id) {
			return editor;
		}
	}
}