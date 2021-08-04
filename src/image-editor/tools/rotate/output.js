import { getLayoutFor } from '../../utils';
export default {
	fixEditorState(editorState) {
		const {
			image,
			formatting: { rotate },
		} = editorState;

		if (!rotate) {
			return editorState;
		}

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		const { degrees } = rotate;

		const vertical = degrees === 90 || degrees === 270;

		const width = vertical ? image.height : image.width;
		const height = vertical ? image.width : image.height;

		canvas.width = width;
		canvas.height = height;

		let cx = width / 2;
		let cy = height / 2;

		if (Math.abs(rotate.degrees) === 90) {
			cx = cy = width / 2;
		} else if (Math.abs(rotate.degrees) === 270) {
			cx = cy = height / 2;
		}

		ctx.save();

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(cx, cy);
		ctx.rotate((rotate.degrees * Math.PI) / 180);
		ctx.translate(-cx, -cy);

		ctx.drawImage(image, 0, 0);

		ctx.restore();

		return {
			...editorState,
			layout: getLayoutFor(canvas, { width, height }),
			image: canvas,
			canvas: {
				...editorState.canvas,
				width,
				height,
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
};
