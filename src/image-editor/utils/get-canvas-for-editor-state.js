import { Crop, Rotate, Blur, Darken } from '../tools';

const TOOLS = [Crop, Rotate, Darken, Blur];

function applyScale(layout, imgScale) {
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

const scalers = {
	maxHeight: (layout, outputSize) => {
		if (layout.canvas.height <= outputSize.maxHeight) {
			return layout;
		}

		const scale = outputSize.maxHeight / layout.canvas.height;
		return applyScale(layout, scale);
	},

	height: (layout, outputSize) => {
		if (layout.canvas.height === outputSize.height) {
			return layout;
		}

		const scale = outputSize.height / layout.canvas.height;
		return applyScale(layout, scale);
	},

	maxWidth: (layout, outputSize) => {
		if (layout.canvas.width <= outputSize.maxWidth) {
			return layout;
		}

		const scale = outputSize.maxWidth / layout.canvas.width;
		return applyScale(layout, scale);
	},

	width: (layout, outputSize) => {
		if (layout.canvas.width === outputSize.width) {
			return layout;
		}

		const scale = outputSize.width / layout.canvas.height;
		return applyScale(layout, scale);
	},
};

function scaleOutput(layout, outputSize) {
	if (!outputSize) {
		return layout;
	}

	let scaled = layout;

	if (outputSize.maxHeight) {
		scaled = scalers.maxHeight(layout, outputSize);
	}
	if (outputSize.height) {
		scaled = scalers.height(layout, outputSize);
	}

	if (outputSize.maxWidth) {
		scaled = scalers.maxWidth(layout, outputSize);
	}
	if (outputSize.width) {
		scaled = scalers.width(layout, outputSize);
	}

	return scaled;
}

export default function getCanvasForEditorState(editorStateArg, outputSize) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	ctx.imageSmoothingQuality = 'high';
	// ctx.imageSmoothingEnabled = false;

	const editorState = TOOLS.reduce((acc, tool) => {
		return tool.output?.fixEditorState?.(acc) ?? acc;
	}, editorStateArg);

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
		outputLayout =
			tool.output?.fixLayout?.(formatting, outputLayout) ?? outputLayout;
	}

	outputLayout = scaleLayout(outputLayout);
	outputLayout = scaleOutput(outputLayout, outputSize);

	canvas.width = outputLayout.canvas.width;
	canvas.height = outputLayout.canvas.height;

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.lineWidth = 1;

	for (let tool of TOOLS) {
		tool.output?.before?.(ctx, formatting, outputLayout, canvas);
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
		tool.output?.after?.(ctx, formatting, outputLayout, canvas);
	}

	return canvas;
}
