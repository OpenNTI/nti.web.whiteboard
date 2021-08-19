import * as StackBlur from 'stackblur-canvas';

export default {
	after(ctx, formatting, layout, canvas) {
		const { blur } = formatting;

		if (!blur || !blur.radius) {
			return;
		}

		const layer = document.createElement('canvas');
		const layerCtx = layer.getContext('2d');
		layerCtx.imageSmoothingQuality = 'high';
		// layerCtx.imageSmoothingEnabled = false;

		layer.width = layout.canvas.width;
		layer.height = layout.canvas.height;

		layerCtx.save();
		layerCtx.drawImage(
			canvas,
			0,
			0,
			layout.canvas.width,
			layout.canvas.height
		);
		layerCtx.restore();

		const pixelData = layerCtx.getImageData(
			0,
			0,
			layer.width,
			layer.height
		);
		const blurredPixelData = StackBlur.imageDataRGBA(
			pixelData,
			0,
			0,
			layer.width,
			layer.height,
			blur.radius
		);

		layerCtx.putImageData(blurredPixelData, 0, 0);

		ctx.drawImage(layer, 0, 0, layer.width, layer.height);
	},
};
