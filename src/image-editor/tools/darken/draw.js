import { Color } from '@nti/lib-commons';

export default {
	after(ctx, formatting, layout, getLayer) {
		const { darken } = formatting;

		if (!darken || !darken.color) {
			return;
		}

		const color = Color(darken.color);
		const alpha = darken.opacity != null ? darken.opacity : 1;

		const layer = getLayer('darken');
		const layerCtx = layer.getContext('2d');

		layer.width = layout.canvas.width;
		layer.height = layout.canvas.height;

		layerCtx.setTransform(1, 0, 0, 1, 0, 0);

		layerCtx.save();
		layerCtx.fillStyle = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${alpha})`;
		layerCtx.fillRect(
			layout.image.x,
			layout.image.y,
			layout.image.width,
			layout.image.height
		);
		layerCtx.restore();

		ctx.drawImage(layer, 0, 0, layer.width, layer.height);
	},
};
