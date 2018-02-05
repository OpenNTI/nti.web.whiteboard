import React from 'react';
import PropTypes from 'prop-types';

import {getLayoutFor} from './utils';
import Upload from './Upload';
import {Crop, Rotate, Blur} from './tools';

const TOOLS = [
	Blur, Crop, Rotate
];

const CANVAS_PADDING = 20;

function getMouseEvent (e, canvas) {
	const rect = canvas.getBoundingClientRect();

	return {
		clientX: e.clientX - rect.left - CANVAS_PADDING,
		clientY: e.clientY - rect.top - CANVAS_PADDING
	};
}

export default class ImageEditor extends React.Component {
	static propTypes = {
		editorState: PropTypes.object,
		onChange: PropTypes.func
	}

	setContainer = x => this.container = x

	setCanvas = x => {
		this.canvas = x;

		this.draw();
	}


	constructor (props) {
		super(props);

		const {editorState} = this.props;

		this.state = {
			initialState: editorState || {},
			currentEditorState: {}
		};
	}

	componentDidMount () {
		const {initialState} = this.state;


		if (initialState) {
			this.setupInitialState(initialState);
		}
	}


	componentDidUpdate (prevProps, prevState) {
		this.draw();

		const {currentEditorState:oldState} = prevState;
		const {currentEditorState:newState} = this.state;

		if (oldState && newState && (oldState.formatting !== newState.formatting || oldState.currentLayout !== newState.currentLayout)) {
			this.onChange();
		}
	}

	get currentState () {
		return this.state.currentEditorState || {};
	}


	get currentLayout () {
		return this.currentState.layout;
	}


	get currentFormatting () {
		return this.currentState.formatting || {};
	}


	get size () {
		return {
			width: this.container ? this.container.clientWidth : null,
			height: this.container ? this.container.clientHeight : null
		};
	}


	getLayerFor = (name) => {
		this.layers = this.layers || {};

		if (!this.layers[name]) {
			this.layers[name] = document.createElement('canvas');
		}

		return this.layers[name];
	}


	onChange () {
		const {onChange} = this.props;

		let {formatting, layout, image} = this.currentState;

		// for (let tool of TOOLS) {
		// 	if (tool.output && tool.output.fixFormatting) {
		// 		formatting = tool.output.fixFormatting(formatting, layout);
		// 	}
		// }

		if (onChange) {
			onChange({formatting, layout, image});
		}
	}


	draw () {
		if (!this.canvas) { return; }

		const {canvas, currentFormatting: formatting, currentLayout: layout} = this;
		const {activeTool} = this.state;
		const ctx = canvas.getContext('2d');

		//reset the canvas
		canvas.width = layout.canvas.width + 2 * CANVAS_PADDING;
		canvas.height = layout.canvas.height + 2 * CANVAS_PADDING;

		ctx.setTransform(1, 0, 0, 1, CANVAS_PADDING, CANVAS_PADDING);
		ctx.lineWidth = 1;

		//do an drawing before the image
		for (let tool of TOOLS) {
			if (tool.draw && tool.draw.before) {
				tool.draw.before(ctx, formatting, layout, this.getLayerFor);
			}
		}

		ctx.save();
		ctx.drawImage(layout.image.src, layout.image.x, layout.image.y, layout.image.width, layout.image.height);
		ctx.restore();


		for (let tool of TOOLS) {
			if (tool.draw && tool.draw.after) {
				tool.draw.after(ctx, formatting, layout, this.getLayerFor);
			}
		}

		if (activeTool && activeTool.draw) {
			activeTool.draw(ctx, formatting, layout);
		}
	}


	fixFormatting (formatting, layout) {
		let newFormat = {...formatting};

		for (let tool of TOOLS) {
			if (tool.fixFormatting) {
				newFormat = tool.fixFormatting(newFormat, layout);
			}
		}

		return newFormat;
	}


	setupInitialState (initialState) {
		const {image, formatting} = initialState;

		if (image) {
			const layout = getLayoutFor(image, this.size, CANVAS_PADDING);

			this.setEditorState({
				image,
				formatting: this.fixFormatting(formatting || {}, layout),
				layout
			});
		} else if (formatting) {
			this.setEditorState({
				formatting
			});
		}
	}


	setActiveControl = (activeControl) => {
		this.setState({
			activeControl
		});
	}


	setEditorState = (newEditorState) => {
		this.setState({
			currentEditorState: {
				...this.currentState,
				...newEditorState
			}
		});
	}


	onImgChange = (image) => {
		const layout = getLayoutFor(image, this.size, CANVAS_PADDING);

		this.setEditorState({
			image,
			formatting: this.fixFormatting(this.currentFormatting, layout),
			layout
		});
	}

	setActiveControl = (activeControl) => {
		this.setState({
			activeControl
		});
	}

	onMouseEvent (name, ...args) {
		const {activeControl} = this.state;

		if (activeControl && activeControl[name]) {
			activeControl[name](...args, this.currentFormatting, this.currentLayout, this.setEditorState);
		}

		for (let tool of TOOLS) {
			if (tool[name]) {
				tool[name](...args, this.currentFormatting, this.currentLayout, this.setEditorState);
			}
		}
	}


	onMouseDown = (e) => this.onMouseEvent('onMouseDown', getMouseEvent(e, this.canvas))
	onMouseUp = (e) => this.onMouseEvent('onMouseUp', getMouseEvent(e, this.canvas))
	onMouseMove = (e) => this.onMouseEvent('onMouseMove', getMouseEvent(e, this.canvas))
	onMouseOut = (e) => this.onMouseEvent('onMouseOut', getMouseEvent(e, this.canvas))


	render () {
		const {cursor} = this.currentState;
		const layout = this.currentLayout;

		const styles = {
			cursor: cursor || 'default'
		};

		const canvasStyles = {
			margin: `${-CANVAS_PADDING}px 0 0 ${-CANVAS_PADDING}px`
		};

		if (layout) {
			styles.height = `${layout.canvas.height}px`;
			styles.width = `${layout.canvas.width}px`;

			canvasStyles.height = `${layout.canvas.height + (2 * CANVAS_PADDING)}px`;
			canvasStyles.width = `${layout.canvas.width + (2 * CANVAS_PADDING)}px`;
		}

		return (
			<div className="nti-image-editor" ref={this.setContainer}>
				{!layout && (<Upload onChange={this.onImgChange}/>)}
				{layout && (
					<div className="canvas-container" style={styles}>
						<canvas
							style={canvasStyles}
							onMouseDown={this.onMouseDown}
							ref={this.setCanvas}
							onMouseUp={this.onMouseUp}
							onMouseMove={this.onMouseMove}
							onMouseOut={this.onMouseOut}
						/>
					</div>
				)}
				{layout && this.renderToolbar()}
			</div>
		);
	}


	renderToolbar () {
		const {activeControl} = this.state;
		const Control = activeControl && activeControl.Component;

		return (
			<div className="tool-bar">
				{Control && (<Control setEditorState={this.setEditorState} formatting={this.currentFormatting} setActiveControl={this.setActiveControl} image={this.currentImage} onImgChange={this.onImgChange}/>)}
				{!Control && this.renderButtons()}
			</div>
		);
	}


	renderButtons () {
		const buttons = TOOLS.map(tool => tool.Button).filter(x => !!x);

		return (
			<ul>
				{
					buttons.map((Button, index) => {
						return (
							<li key={index}>
								<Button setEditorState={this.setEditorState} formatting={this.currentFormatting} setActiveControl={this.setActiveControl} />
							</li>
						);
					})
				}
			</ul>
		);
	}
}
