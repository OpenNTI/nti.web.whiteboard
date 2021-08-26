import { normalizeRotatedDimensions } from '../../utils';

import { CORNER_RADIUS } from './constants';

export default {
	after(ctx, formatting, layout, getLayerFor) {
		const { crop, rotate } = formatting || {};

		if (!crop) {
			return;
		}

		const layer = getLayerFor('crop');
		const layerCtx = layer.getContext('2d');
		layerCtx.imageSmoothingQuality = 'high';
		// layerCtx.imageSmoothingEnabled = false;

		//Draw the mask as a layer
		layer.width = layout.canvas.width;
		layer.height = layout.canvas.height;

		const imageDimensions = normalizeRotatedDimensions(
			rotate?.degrees,
			layout.image
		);

		layerCtx.setTransform(1, 0, 0, 1, 0, 0);
		layerCtx.lineWidth = 1;

		layerCtx.save();
		layerCtx.fillStyle = 'rgba(0,0,0,0.7)';
		layerCtx.fillRect(
			layout.image.x,
			layout.image.y,
			imageDimensions.width,
			imageDimensions.height
		);
		layerCtx.restore();

		layerCtx.save();
		layerCtx.fillStyle = '#000';
		layerCtx.globalCompositeOperation = 'destination-out';
		layerCtx.fillRect(crop.x, crop.y, crop.width, crop.height);
		layerCtx.restore();

		layerCtx.save();
		layerCtx.strokeStyle = 'rgba(255,255,255,0.7)';
		layerCtx.strokeRect(crop.x, crop.y, crop.width, crop.height);
		layerCtx.restore();

		ctx.drawImage(layer, 0, 0, layer.width, layer.height);

		//Draw the controls directly to the canvas
		ctx.save();
		ctx.fillStyle = '#fff';
		ctx.strokeStyle = '#ccc';
		ctx.lineWidth = 1;
		ctx.globalCompositeOperation = 'source-over';
		ctx.globalAlpha = 1;

		function nib(x, y, noStroke) {
			ctx.beginPath();

			ctx.arc(x, y, CORNER_RADIUS, 0, Math.PI * 2);
			// ctx.endPath();
			ctx.fill();
			if (!noStroke) {
				ctx.stroke();
			}
		}

		ctx.save();
		ctx.shadowColor = 'rgba(0,0,0,0.5)';
		ctx.shadowBlur = 3;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 2;

		nib(crop.x, crop.y, true);
		nib(crop.x + crop.width, crop.y, true);
		nib(crop.x + crop.width, crop.y + crop.height, true);
		nib(crop.x, crop.y + crop.height, true);
		ctx.restore();

		nib(crop.x, crop.y);
		nib(crop.x + crop.width, crop.y);
		nib(crop.x + crop.width, crop.y + crop.height);
		nib(crop.x, crop.y + crop.height);

		ctx.restore();
	},
};

// const {crop} = formatting || {};

// if (!crop) { return; }

// //Draw the mask
// ctx.save();
// ctx.fillStyle = 'rgba(0,0,0,0.7)';
// ctx.fillRect(layout.image.x, layout.image.y, layout.image.width, layout.image.height);
// ctx.restore();

// //cut out the masked area
// ctx.save();
// ctx.fillStyle = '#000';
// ctx.globalCompositeOperation = 'destination-out';
// ctx.fillRect(crop.x, crop.y, crop.width, crop.height);
// ctx.restore();
