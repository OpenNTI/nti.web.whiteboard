export default function fixCropFormatting (formatting, layout) {
	const {crop} = formatting;

	if (!crop) { return formatting; }

	let {aspectRatio, width, height, x = layout.canvas.padding, y = layout.canvas.padding} = crop;


	function getHeight (w, fallback) {
		return aspectRatio ? Math.ceil(w / aspectRatio) : fallback;
	}

	function getWidth (h, fallback) {
		return aspectRatio ? Math.ceil(h * aspectRatio) : fallback;
	}

	if (!width && !height) {
		width = layout.image.width;
	}

	if (width && !height) {
		height = getHeight(width, height);
	} else if (height) {
		width = getWidth(height, width);
	}

	if (x + width > layout.image.width) {
		width = layout.image.width - x;
		height = getHeight(width, height);
	}

	if (y + height > layout.image.height) {
		height = layout.image.height - y;
		width = getWidth(height, width);
	}

	return {
		...formatting,
		crop: {
			x, y,
			width,
			height,
			aspectRatio
		}
	};
}
