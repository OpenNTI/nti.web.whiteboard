import {CORNER_RADIUS} from './Constants';

export default {
	before (ctx, formatting, layout) {
		const {crop} = formatting || {};

		if (!crop) { return; }

		//Draw the mask
		ctx.save();
		ctx.fillStyle = 'rgba(0,0,0,0.7)';
		ctx.fillRect(layout.image.x, layout.image.y, layout.image.width, layout.image.height);
		ctx.restore();

		//cut out the masked area
		ctx.save();
		ctx.fillStyle = '#000';
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillRect(crop.x, crop.y, crop.width, crop.height);
		ctx.restore();
	},

	after (ctx, formatting, layout) {
		const {crop} = formatting || {};

		if (!crop) { return; }

		ctx.save();
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
		ctx.restore();

		ctx.save();
		ctx.fillStyle = '#fff';
		ctx.strokeStyle = '#ccc';
		ctx.lineWidth = 1;
		ctx.globalCompositeOperation = 'source-over';
		ctx.globalAlpha = 1;

		function nib (x, y, noStroke) {
			ctx.beginPath();

			ctx.arc(x, y, CORNER_RADIUS, 0, Math.PI * 2);
			// ctx.endPath();
			ctx.fill();
			if (!noStroke) { ctx.stroke(); }
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
	}
};
