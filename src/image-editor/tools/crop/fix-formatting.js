//aspect ratio: w / h
const clamp = (x, min, max) => Math.max(min, Math.min(x, max));

export default function fixCropFormatting(formatting, layout) {
	const { crop } = formatting;

	if (!crop) {
		return formatting;
	}

	let {
		aspectRatio,
		maxAspectRatio,
		minAspectRatio,
		width,
		height,
		x = 0,
		y = 0,
	} = crop;

	const effectiveAspectRatio = clamp(
		aspectRatio ?? layout.canvas.width / layout.canvas.height,
		minAspectRatio ?? -Infinity,
		maxAspectRatio ?? Infinity
	);

	function getHeight(w, fallback) {
		return effectiveAspectRatio
			? Math.ceil(w / effectiveAspectRatio)
			: fallback;
	}

	function getWidth(h, fallback) {
		return effectiveAspectRatio
			? Math.ceil(h * effectiveAspectRatio)
			: fallback;
	}

	if (!width && !height) {
		width = layout.canvas.width;
	}

	if (width && !height) {
		height = getHeight(width, height);
	} else if (height && !width) {
		width = getWidth(height, width);
	}

	if (x + width > layout.canvas.width) {
		width = layout.canvas.width - x;
		height = getHeight(width, height);
	}

	if (y + height > layout.canvas.height) {
		height = layout.canvas.height - y;
		width = getWidth(height, width);
	}

	return {
		...formatting,
		crop: {
			x,
			y,
			width,
			height,
			aspectRatio: effectiveAspectRatio,
			aspectRatioLocked: aspectRatio != null,
			maxAspectRatio,
			minAspectRatio,
		},
	};
}
