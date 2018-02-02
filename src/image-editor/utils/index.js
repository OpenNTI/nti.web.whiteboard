export getBlobForEditorState from './get-blob-for-editor-state';
export getEditorState from './get-editor-state';
export getImageForEditorState from './get-image-for-editor-state';

export function getImgSrc (file) {
	return new Promise(function (fulfill, reject) {
		if(file && file.name) {
			const reader = new FileReader();

			reader.onload = ((f) => {
				return (e) => {
					fulfill(e.target.result);
				};
			})(file);

			reader.readAsDataURL(file);
		}
	});
}


export function getLayoutFor (img, size) {
	const imgSize = {height: img.height, width: img.width};
	const canvasSize = {height: size.height, width: size.width};
	const scale = img.width / canvasSize.width;

	if (imgSize.width > canvasSize.width) {
		imgSize.width = Math.round(imgSize.width / scale);
		imgSize.height = Math.round(imgSize.height / scale);
	}

	canvasSize.width = imgSize.width;
	canvasSize.height = imgSize.height;

	const x = Math.round((canvasSize.width - imgSize.width) / 2);
	const y = Math.round((canvasSize.height - imgSize.height) / 2);

	return {
		image: {
			src: img,
			x, y,
			width: imgSize.width,
			height: imgSize.height
		},
		canvas: {
			width: canvasSize.width,
			height: canvasSize.height
		}
	};
}
