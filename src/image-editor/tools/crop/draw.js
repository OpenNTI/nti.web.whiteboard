function getFormat (format, imageInfo) {
	return {
		width: format.width,
		height: format.height,
		x: format.x == null ? (imageInfo.x + (imageInfo.width / 2) - (format.width / 2)) : format.x,
		y: format.y == null ? (imageInfo.y + (imageInfo.height / 2) - (format.height / 2)) : format.y
	};
}

function getMask (size = 0, pixAdj = 0, imageInfo = {}, format) {
	format = getFormat(format || {height:0, width: 0}, imageInfo);

	return [
		Math.ceil(imageInfo.x + format.x - size) + pixAdj,
		Math.ceil(imageInfo.y + format.y - size) + pixAdj,
		Math.ceil(format.width + (size * 2)),
		Math.ceil(format.height + (size * 2))
	];
}


function formatCrop (crop, layout) {

}

export default {
	before (ctx, formatting, layout) {
		const {crop} = formatting || {};

		if (!crop) { return; }

		//Draw the mask
		ctx.save();
		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.fillRect(layout.image.x, layout.image.y, layout.image.width, layout.image.height);
		ctx.restore();

		//cut out the masked area
		ctx.save();
		ctx.fillStyle = '#000';
		ctx.globalCompositeOperation = 'destination-out';
		// ctx.fillRect(...getMask(0, 0, imageInfo, crop));
		ctx.restore();
	},

	after (ctx, formatting, imageInfo) {
		const {crop} = formatting || {};

		if (!crop) { return; }

		ctx.strokeStyle = '#fff';
		ctx.strokeRect(...getMask(0, 0.5, imageInfo, crop));
		ctx.strokeStyle = '#000';
		ctx.strokeRect(...getMask(1, 0.5, imageInfo, crop));
	}
};
