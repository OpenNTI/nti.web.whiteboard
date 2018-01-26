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

export function drawFromImg (canvas, img) {
	const ctx = canvas.getContext('2d');

	const { width, height } = img;

	const ratio = height / width;

	canvas.width = 800;
	canvas.height = ratio * canvas.width;

	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}
