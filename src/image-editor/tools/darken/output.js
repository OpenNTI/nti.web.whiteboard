import {Color} from '@nti/lib-commons';

export default {
	after (ctx, formatting, layout) {
		const {darken} = formatting;

		if (!darken || !darken.color || darken.opacity === 0) { return; }

		const color = Color(darken.color);
		const alpha = darken.opacity ?? 1;

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${alpha})`;
		ctx.fillRect(0, 0, layout.canvas.width, layout.canvas.height);
		ctx.restore();
	}
};