import {Crop, Rotate, Blur, Darken} from '../tools';

const TOOLS = [Crop, Rotate, Darken,  Blur];

export default function getCanvasForEditorState (editorState) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	const {layout, formatting, image} = editorState;

	if (!image) { return null; }

	let outputLayout = layout || {
		image: {
			src: image,
			x: 0, y: 0,
			width: image ? image.width : 0,
			height: image ? image.height : 0
		},
		canvas: {
			padding: 0,
			width: image ? image.width : 0,
			height: image ? image.height : 0
		}
	};

	for (let tool of TOOLS) {
		if (tool.output && tool.output.fixLayout) {
			outputLayout = tool.output.fixLayout(formatting, outputLayout);
		}
	}

	canvas.width = outputLayout.canvas.width;
	canvas.height = outputLayout.canvas.height;

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.lineWidth = 1;

	for (let tool of TOOLS) {
		if (tool.output && tool.output.before) {
			tool.output.before(ctx, formatting, outputLayout);
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
			tool.output.after(ctx, formatting, outputLayout);
		}
	}

	return canvas;
}
