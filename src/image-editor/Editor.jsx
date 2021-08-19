import './Editor.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { getLayoutFor } from './utils';
import Upload from './Upload';
import { Crop, Rotate, Blur, Darken } from './tools';
import Toolbar from './tool-bar';
import { CANVAS_PADDING } from './constants';

const TOOLS = [Blur, Darken, Crop, Rotate];

export default class ImageEditor extends React.Component {
	static Controls = Toolbar.Controls;

	static propTypes = {
		editorState: PropTypes.object,
		onChange: PropTypes.func,
		allowedControls: PropTypes.any,
	};

	setContainer = x => (this.container = x);

	setCanvas = x => {
		this.canvas = x;

		this.draw();
	};

	constructor(props) {
		super(props);

		const { editorState } = this.props;

		this.state = {
			initialState: editorState || {},
			currentEditorState: {},
		};

		this.canvasListeners = {};

		for (let tool of TOOLS) {
			for (let listener of tool.listeners ?? []) {
				if (!this.canvasListeners[listener]) {
					this.canvasListeners[listener] =
						this.buildCanvasListener(listener);
				}
			}
		}
	}

	componentDidMount() {
		const { initialState } = this.state;

		if (initialState) {
			this.setupInitialState(initialState);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		this.draw();

		const { currentEditorState: oldState } = prevState;
		const { currentEditorState: newState } = this.state;

		if (
			oldState &&
			newState &&
			(oldState.formatting !== newState.formatting ||
				oldState.currentLayout !== newState.currentLayout)
		) {
			this.onChange();
		}
	}

	get currentState() {
		return this.state.currentEditorState || {};
	}

	get currentLayout() {
		return this.currentState.layout;
	}

	get currentFormatting() {
		return this.currentState.formatting || {};
	}

	get size() {
		return {
			width: this.container ? this.container.clientWidth : null,
			height: this.container ? this.container.clientHeight : null,
		};
	}

	getLayerFor = name => {
		this.layers = this.layers || {};

		if (!this.layers[name]) {
			this.layers[name] = document.createElement('canvas');
		}

		return this.layers[name];
	};

	onChange() {
		const { onChange } = this.props;

		let { formatting, layout, image, filename } = this.currentState;

		if (onChange) {
			onChange({ formatting, layout, image, filename });
		}
	}

	draw() {
		if (!this.canvas) {
			return;
		}

		const {
			canvas,
			currentFormatting: formatting,
			currentLayout: layout,
		} = this;
		const { activeTool } = this.state;
		const ctx = canvas.getContext('2d');

		const padding = 2 * CANVAS_PADDING;
		const { width, height } = layout.canvas;

		//reset the canvas
		canvas.width = width + padding;
		canvas.height = height + padding;

		ctx.setTransform(1, 0, 0, 1, CANVAS_PADDING, CANVAS_PADDING);
		ctx.lineWidth = 1;

		//do an drawing before the image
		for (let tool of TOOLS) {
			tool.draw?.before?.(ctx, formatting, layout, this.getLayerFor);
		}

		ctx.save();
		for (let tool of TOOLS) {
			tool?.draw?.applyImageTransform?.(ctx, formatting, layout);
		}
		ctx.drawImage(
			layout.image.src,
			layout.image.x,
			layout.image.y,
			layout.image.width,
			layout.image.height
		);
		ctx.restore();

		for (let tool of TOOLS) {
			tool.draw?.after?.(ctx, formatting, layout, this.getLayerFor);
		}

		activeTool?.draw?.(ctx, formatting, layout);
	}

	fixFormatting(formatting, layout) {
		let newFormat = { ...formatting };

		for (let tool of TOOLS) {
			newFormat = tool.fixFormatting?.(newFormat, layout) ?? newFormat;
		}

		return newFormat;
	}

	setupInitialState(initialState) {
		const { image, formatting } = initialState;

		if (image) {
			const layout = getLayoutFor(image, this.size, CANVAS_PADDING);

			this.setEditorState({
				image,
				formatting: this.fixFormatting(formatting || {}, layout),
				layout,
			});
		} else if (formatting) {
			this.setEditorState({
				formatting,
			});
		}
	}

	setActiveControl = activeControl => {
		this.setState({
			activeControl,
		});
	};

	setEditorState = newEditorState => {
		this.setState({
			currentEditorState: {
				...this.currentState,
				...newEditorState,
			},
		});
	};

	onImgChange = (image, filename) => {
		const layout = getLayoutFor(image, this.size, CANVAS_PADDING);

		this.setEditorState({
			image,
			filename,
			formatting: this.fixFormatting(this.currentFormatting, layout),
			layout,
		});
	};

	setActiveControl = activeControl => {
		this.setState({
			activeControl,
		});
	};

	buildCanvasListener(name) {
		return e => {
			e.stopPropagation();
			e.preventDefault();

			const { activeControl } = this.state;
			const eventArgs = [
				e,
				{
					canvas: this.canvas,
					padding: CANVAS_PADDING,
					formatting: this.currentFormatting,
					layout: this.currentLayout,
					setEditorState: this.setEditorState,
				},
			];

			activeControl?.[name]?.(...eventArgs);

			for (let tool of TOOLS) {
				tool[name]?.(...eventArgs);
			}
		};
	}

	render() {
		const { cursor } = this.currentState;
		const layout = this.currentLayout;

		const styles = {
			cursor: cursor || 'default',
		};

		const canvasStyles = {
			margin: `${-CANVAS_PADDING}px 0 0 ${-CANVAS_PADDING}px`,
		};

		if (layout) {
			styles.height = `${layout.canvas.height}px`;
			styles.width = `${layout.canvas.width}px`;

			canvasStyles.height = `${
				layout.canvas.height + 2 * CANVAS_PADDING
			}px`;
			canvasStyles.width = `${
				layout.canvas.width + 2 * CANVAS_PADDING
			}px`;
		}

		return (
			<div className="nti-image-editor" ref={this.setContainer}>
				{!layout && <Upload onChange={this.onImgChange} />}
				{layout && (
					<div className="canvas-container" style={styles}>
						<canvas
							style={canvasStyles}
							onMouseDown={this.onMouseDown}
							ref={this.setCanvas}
							{...this.canvasListeners}
						/>
					</div>
				)}
				{layout && this.renderToolbar()}
			</div>
		);
	}

	renderToolbar() {
		const { allowedControls } = this.props;

		return (
			<Toolbar
				setEditorState={this.setEditorState}
				editorState={this.currentState}
				allowedControls={allowedControls}
			/>
		);
	}
}
