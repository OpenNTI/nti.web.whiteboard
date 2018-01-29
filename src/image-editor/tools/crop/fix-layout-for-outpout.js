export default function fixLayoutForOutput (layout, formatting) {
	const {crop} = formatting;

	if (!crop) { return layout; }

	return {
		image: {
			src: layout.image.src,
			x: -crop.x,
			y: -crop.y,
			width: layout.image.width,
			height: layout.image.height
		},
		canvas: {
			padding: 0,
			width: crop.width,
			height: crop.height
		}
	};
}
