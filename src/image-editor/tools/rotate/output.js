export default {
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
};
