import { getLayout } from '../../utils';

const switchImageDimensions = (degrees, image) => {
	const vertical = degrees === 90 || degrees === 270;

	const width = vertical ? image.height : image.width;
	const height = vertical ? image.width : image.height;

	return { width, height };
};

export default {
	/**
	 * This method creates an entirely new rotated image and accordingly updates
	 * the editor state's image source with the aforementioned rotated image.
	 * This helps us separate the rotate tool from other tools.
	 *
	 * @param {object} editorState
	 * @returns {object}
	 */
	fixEditorState(editorState) {
		const {
			image,
			formatting: { rotate },
		} = editorState;

		if (!rotate?.degrees) {
			return editorState;
		}

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		ctx.imageSmoothingQuality = 'high';
		// ctx.imageSmoothingEnabled = false;

		const { width, height } = switchImageDimensions(rotate.degrees, image);

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
			layout: getLayout(canvas, { width, height }),
			image: canvas,
			canvas: {
				...editorState.canvas,
				width,
				height,
			},
		};
	},
};
