import fixFormatting from './fix-formatting';

export default {
	fixLayout(formatting, layout) {
		const { crop } = fixFormatting(formatting, layout);

		if (!crop) {
			return {
				image: {
					src: layout.image.src,
					scale: layout.image.scale,
					x: 0,
					y: 0,
					width: layout.image.width,
					height: layout.image.height,
				},
				canvas: {
					padding: 0,
					width: layout.image.width,
					height: layout.image.height,
				},
			};
		}

		return {
			image: {
				src: layout.image.src,
				scale: layout.image.scale,
				x: -crop.x,
				y: -crop.y,
				width: layout.image.width,
				height: layout.image.height,
			},
			canvas: {
				padding: 0,
				width: crop.width,
				height: crop.height,
			},
		};
	},

	fixFormatting(formatting, layout) {
		const { crop } = formatting;

		if (!crop) {
			return formatting;
		}

		return {
			...formatting,
			crop: {
				...crop,
				x: -crop.x,
				y: -crop.y,
			},
		};
	},
};
