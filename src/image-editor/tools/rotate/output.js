export default {
	fixLayout(formatting, layout) {
		const { rotate } = formatting;

		if (!rotate) {
			return layout;
		}
		const { degrees } = rotate;

		const vertical = degrees === 90 || degrees === 270;

		const width = layout.canvas.width;
		const height = layout.canvas.height;

		return {
			...layout,
			image: {
				...layout.image,
				src: layout.image.src,
				scale: layout.image.scale,
				width: vertical ? height : width,
				height: vertical ? width : height,
			},
		};
	},

	applyImageTransform(ctx, formatting, layout) {
		const { rotate } = formatting;

		if (!rotate?.degrees) {
			return;
		}

		let cx = layout.canvas.width / 2;
		let cy = layout.canvas.height / 2;

		if (Math.abs(rotate.degrees) === 90) {
			cx = cy = layout.canvas.width / 2;
		} else if (Math.abs(rotate.degrees) === 270) {
			cx = cy = layout.canvas.height / 2;
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(cx, cy);
		ctx.rotate((rotate.degrees * Math.PI) / 180);
		ctx.translate(-cx, -cy);
	},

	// fixFormatting(formatting, layout) {
	// 	const { rotate, crop } = formatting;
	// 	if (!rotate ||) {
	// 		return layout;
	// 	}
	// 	const { degrees } = rotate;
	// 	const vertical = degrees === 90 || degrees === 270;
	// 	const width = layout.image.width;
	// 	const height = layout.image.height;
	// 	return {
	// 		image: {
	// 			...layout.image,
	// 			src: layout.image.src,
	// 			scale: layout.image.scale,
	// 			width: layout.image.width,
	// 			height: layout.image.height,
	// 		},
	// 		canvas: {
	// 			...layout.canvas,
	// 			width: vertical ? height : width,
	// 			height: vertical ? width : height,
	// 		},
	// 	};
	// }
};
