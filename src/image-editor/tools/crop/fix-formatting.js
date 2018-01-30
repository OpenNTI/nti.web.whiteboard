import handlers from './handlers';

export default function fixCropFormatting (formatting, layout) {
	const {crop} = formatting;

	if (!crop) { return formatting; }

	if (!crop.width || !crop.height) {
		return handlers.initial(formatting, layout);
	}

	if (crop.width > layout.canvas.width - (layout.canvas.padding * 2)) {
		crop.width = layout.canvas.width - (layout.canvas.padding * 2);
	}

	if (crop.height > layout.canvas.height - (layout.canvas.padding * 2)) {
		crop.height = layout.canvas.height - (layout.canvas.padding * 2);
	}


	if (!crop.x || !crop.y) {
		crop.x = layout.image.x + (layout.image.width / 2) - (crop.width / 2);
		crop.y = layout.image.y + (layout.image.height / 2) - (crop.height / 2);
	}

	return {
		...formatting,
		crop: {...crop}
	};
}
