import fixFormatting from './fix-formatting';

export default {
	fixLayout (formatting, layout) {
		const {crop} = fixFormatting(formatting, layout);

		if (!crop) {
			return {
				image: {
					src: layout.image.src,
					x: 0,
					y: 0,
					width: layout.image.width,
					height: layout.image.height
				},
				canvas: {
					padding: 0,
					width: layout.image.width,
					height: layout.image.height
				}
			};
		}

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
				width: Math.min(crop.width, layout.image.width),
				height: Math.min(crop.height, layout.image.height)
			}
		};
	}
};
