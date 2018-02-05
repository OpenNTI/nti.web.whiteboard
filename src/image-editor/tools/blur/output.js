import StackBlur from 'stackblur-canvas';

export default {
	after (ctx, formatting, layout) {
		const {blur} = formatting;

		if (!blur || !blur.radius) { return; }

		const pixelData = ctx.getImageData(0, 0, layout.canvas.width, layout.canvas.height);
		const blurredPixelData = StackBlur.imageDataRGBA(pixelData, 0, 0, layout.canvas.width, layout.canvas.height, blur.radius);

		ctx.putImageData(blurredPixelData, 0, 0);
	}
};
