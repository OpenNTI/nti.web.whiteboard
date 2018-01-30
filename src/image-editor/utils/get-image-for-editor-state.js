import {Crop, Rotate} from '../tools';

const TOOLS = [Crop, Rotate];

export default function getImageForEditorState (editorState) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	const {layout, formatting} = editorState;

	let outputLayout = layout;

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
		if (tool.outpout && tool.output.before) {
			tool.output.before(ctx, formatting, layout);
		}
	}

	ctx.save();
	ctx.drawImage(outputLayout.image.src, outputLayout.image.x, outputLayout.image.y, outputLayout.image.width, outputLayout.image.height);
	ctx.restore();

	for (let tool of TOOLS) {
		if (tool.output && tool.output.after) {
			tool.output.after(ctx, formatting, layout);
		}
	}

	return new Promise((fulfill, reject) => {
		const img = new Image();

		img.onload = () => {
			fulfill(img);
		};

		img.src = canvas.toDataURL();
	});
}
