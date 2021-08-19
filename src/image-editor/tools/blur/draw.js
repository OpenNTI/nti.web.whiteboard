import * as StackBlur from 'stackblur-canvas';

function getHashFor(blur, layout) {
	const fileID = layout.image.src.getAttribute('data-file-id') || 'img';

	return `${fileID}-${blur.radius}-${layout.canvas.width}-${layout.canvas.height}`;
}

export default {
	after(ctx, formatting, layout, getLayer) {
		const { blur } = formatting;

		if (!blur || !blur.radius) {
			return;
		}

		const hash = getHashFor(blur, layout);

		const layer = getLayer('blur');

		//if the layer already has the same hash don't recompute it
		if (layer.getAttribute('data-blur-hash') !== hash) {
			layer.setAttribute('data-blur-hash', hash);

			const layerCtx = layer.getContext('2d');
			layerCtx.imageSmoothingQuality = 'high';
			// layerCtx.imageSmoothingEnabled = false;

			layer.width = layout.canvas.width;
			layer.height = layout.canvas.height;

			layerCtx.save();
			layerCtx.drawImage(
				layout.image.src,
				layout.image.x,
				layout.image.y,
				layout.image.width,
				layout.image.height
			);
			layerCtx.restore();

			const pixelData = layerCtx.getImageData(
				0,
				0,
				layout.canvas.width,
				layout.canvas.height
			);
			const blurredPixelData = StackBlur.imageDataRGBA(
				pixelData,
				0,
				0,
				layout.canvas.width,
				layout.canvas.height,
				blur.radius
			);

			layerCtx.putImageData(blurredPixelData, 0, 0);
		}

		ctx.drawImage(layer, 0, 0, layer.width, layer.height);
	},
};
