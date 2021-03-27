import { Crop, Rotate, Blur, Darken } from '../tools';

const TOOLS = [Crop, Rotate, Darken, Blur];

function applyScale (layout, imgScale) {
	const scale = x => x * imgScale;

	return {
		image: {
			...layout.image,
			x: scale(layout.image.x),
			y: scale(layout.image.y),
			width: scale(layout.image.width),
			height: scale(layout.image.height),
		},
		canvas: {
			...layout.canvas,
			width: scale(layout.canvas.width),
			height: scale(layout.canvas.height),
		},
	};
}

function scaleLayout(layout) {
	const scale = Math.max(layout.image.scale ?? 1, 1);

	return applyScale(layout, scale);
}

function scaleOutput(layout, outputSize) {
	if (!outputSize) { return layout; }

	//Throw for non-supported options yet
	if (outputSize.maxWidth) { throw new Error('maxWidth is not supported in outputSize yet.'); }
	if (outputSize.height) { throw new Error('height is not supported by outputSize yet.'); }
	if (outputSize.width) { throw new Error('width is not supported in outputSize yet.'); }

	if (layout.canvas.height <= outputSize.maxHeight) { return layout; }

	const scale = outputSize.maxHeight / layout.canvas.height;

	return applyScale(layout, scale);
}

export default function getCanvasForEditorState(editorState, outputSize) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	const { layout, formatting, image } = editorState;

	if (!image) {
		return null;
	}

	let outputLayout = layout || {
		image: {
			src: image,
			scale: 1,
			x: 0,
			y: 0,
			width: image ? image.width : 0,
			height: image ? image.height : 0,
		},
		canvas: {
			padding: 0,
			width: image ? image.width : 0,
			height: image ? image.height : 0,
		},
	};

	for (let tool of TOOLS) {
		if (tool.output && tool.output.fixLayout) {
			outputLayout = tool.output.fixLayout(formatting, outputLayout);
		}
	}

	outputLayout = scaleLayout(outputLayout);
	outputLayout = scaleOutput(outputLayout, outputSize);

	canvas.width = outputLayout.canvas.width;
	canvas.height = outputLayout.canvas.height;

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.lineWidth = 1;

	for (let tool of TOOLS) {
		if (tool.output && tool.output.before) {
			tool.output.before(ctx, formatting, outputLayout, canvas);
		}
	}

	ctx.save();
	ctx.drawImage(
		outputLayout.image.src,
		outputLayout.image.x,
		outputLayout.image.y,
		outputLayout.image.width,
		outputLayout.image.height
	);
	ctx.restore();

	for (let tool of TOOLS) {
		if (tool.output && tool.output.after) {
			tool.output.after(ctx, formatting, outputLayout, canvas);
		}
	}

	return canvas;
}
