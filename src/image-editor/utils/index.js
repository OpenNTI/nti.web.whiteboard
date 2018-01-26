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
