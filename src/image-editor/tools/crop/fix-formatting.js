export default function fixCropFormatting (formatting, layout) {
	const {crop} = formatting;

	if (!crop) { return formatting; }

	//TODO: account for more incorrect crops


	if (!crop.x || !crop.y) {
		crop.x = layout.image.x + (layout.image.width / 2) - (crop.width / 2);
		crop.y = layout.image.y + (layout.image.height / 2) - (crop.height / 2);
	}

	return {
		...formatting,
		crop: {...crop}
	};
}
