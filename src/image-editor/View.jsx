import React from 'react';
import PropTypes from 'prop-types';

import {getLayoutFor} from './utils';
import Upload from './Upload';
import {Crop, Rotate} from './tools';

const TOOLS = [
	Crop, Rotate
];

const CANVAS_PADDING = 7;

export default class ImageEditor extends React.Component {
	static propTypes = {
		image: PropTypes.any,
		formatting: PropTypes.object
	}

	setContainer = x => this.container = x

	setCanvas = x => {
		this.canvas = x;

		this.draw();
	}


	constructor (props) {
		super(props);

		const {formatting, image} = this.props;

		this.state = {
			currentEditorState: {
				image,
				formatting: formatting || {}
			}
		};
	}

	componentDidUpdate () {
		this.draw();
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


	draw () {
		if (!this.canvas) { return; }

		const {canvas, currentFormatting: formatting, currentLayout: layout} = this;
		const {activeTool} = this.state;
		const ctx = canvas.getContext('2d');

		//reset the canvas
		canvas.width = layout.canvas.width;
		canvas.height = layout.canvas.height;

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.lineWidth = 1;

		//do an drawing before the image
		for (let tool of TOOLS) {
			if (tool.draw && tool.draw.before) {
				tool.draw.before(ctx, formatting, layout);
			}
		}

		ctx.save();
		ctx.globalCompositeOperation = 'destination-over';
		ctx.drawImage(layout.image.src, layout.image.x, layout.image.y, layout.image.width, layout.image.height);
		ctx.restore();


		for (let tool of TOOLS) {
			if (tool.draw && tool.draw.after) {
				tool.draw.after(ctx, formatting, layout);
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
			activeControl[name](...args, this.canvas, this.currentFormatting, this.currentLayout, this.setEditorState);
		}

		for (let tool of TOOLS) {
			if (tool[name]) {
				tool[name](...args, this.canvas, this.currentFormatting, this.currentLayout, this.setEditorState);
			}
		}
	}


	onMouseDown = (e) => this.onMouseEvent('onMouseDown', e)
	onMouseUp = (e) => this.onMouseEvent('onMouseUp', e)
	onMouseMove = (e) => this.onMouseEvent('onMouseMove', e)
	onMouseOut = (e) => this.onMouseEvent('onMouseOut', e)


	render () {
		const {cursor} = this.currentState;
		const layout = this.currentLayout;

		const styles = {
			cursor: cursor || 'default'
		};

		if (layout) {
			styles.height = `${layout.canvas.height}px`;
			styles.width = `${layout.canvas.width}px`;
		}

		return (
			<div className="nti-image-editor" ref={this.setContainer}>
				{!layout && (<Upload onChange={this.onImgChange}/>)}
				{layout && (
					<div className="canvas-container" style={styles}>
						<canvas
							onMouseDown={this.onMouseDown}
							ref={this.setCanvas}
							onMouseUp={this.onMouseUp}
							onMouseMove={this.onMouseMove}
							onMouseOut={this.onMouseOut}
							width={5}
							height={3}
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
