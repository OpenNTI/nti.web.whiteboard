const type = 'image/svg+xml';

export default function getSVGDataURL (svg) {
	const blob = new Blob([svg], {type});
	const reader = new FileReader();

	return new Promise((fulfill, reject) => {
		reader.onload = (e) => fulfill(e.target.result);
		reader.onerror = (e) => reject(e);

		reader.readAsDataURL(blob);
	});
}