import { Crop, Rotate, Blur, Darken } from '../tools';

const TOOLS = [Crop, Rotate, Darken, Blur];

function scaleLayout(layout) {
	const imgScale = Math.max(layout.image.scale ?? 1, 1);
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

export default function getCanvasForEditorState(editorState) {
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
