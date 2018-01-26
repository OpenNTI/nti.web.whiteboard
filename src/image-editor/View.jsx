import React from 'react';
import PropTypes from 'prop-types';

import Upload from './Upload';
import {Crop} from './tools';

const TOOLS = [
	Crop
];

export default class ImageEditor extends React.Component {
	static propTypes = {
		image: PropTypes.any,
		editorState: PropTypes.object
	}

	attachImgRef = x => this.imgRef = x
	attachFileRef = x => this.fileInput = x



	setCanvas = x => {
		debugger;
		this.canvas = x;
		this.draw();
	}


	constructor (props) {
		super(props);

		const {editorState, image} = this.props;

		this.state = {
			hasImage: false,
			currentState: {
				image,
				formatting: editorState || {}
			}
		};
	}

	componentDidUpdate () {
		this.draw();
	}

	get currentState () {
		return this.state.currentEditorState || {};
	}


	get currentImage () {
		return this.currentState.image;
	}


	get currentFormatting () {
		return this.currentState.formatting || {};
	}


	draw () {
		if (!this.canvas) { return; }

		const {canvas, currentFormatting, currentImage} = this;
		const {activeTool} = this.state;
		const ctx = canvas.getContext('2d');

		//clear canvas

		//Draw the Image
		const { width, height } = currentImage;

		ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

		for (let tool of TOOLS) {
			if (tool.format) {
				tool.format(ctx, currentFormatting);
			}
		}

		if (activeTool && activeTool.draw) {
			activeTool.draw(ctx, currentFormatting);
		}
	}


	setActiveControl = (activeControl) => {
		this.setState({
			activeControl
		});
	}


	setEditorState = (newEditorState) => {
		this.setState({
			currentEditorState: { ...newEditorState }
		});
	}


	onImgChange = (image) => {
		debugger;
		this.setEditorState({
			...this.currentState,
			image
		});
	}


	setActiveControl = (activeControl) => {
		this.setState({
			activeControl
		});
	}

	callOnActiveControl (name, ...args) {
		const {activeControl} = this.state;

		if (activeControl[name]) {
			activeControl[name](...args, this.setEditorState, this.currentFormat);
		}
	}


	onMouseDown = (e) => this.callOnActiveControl('onMouseDown', e)
	onMouseUp = (e) => this.callOnActiveControl('onMouseUp', e)
	onMouseMove = (e) => this.callOnActiveControl('onMouseMove', e)
	onMouseOut = (e) => this.callOnActiveControl('onMouseOut', e)


	render () {
		const {currentState} = this.state;

		if(!this.currentImage) {
			return <Upload onChange={this.onImgChange}/>;
		}

		return (
			<div className="nti-image-editor">
				<canvas
					ref={this.setCanvas}
					onMouseDown={this.onMouseDown}
					onMouseUp={this.onMouseUp}
					onMouseMove={this.onMouseMove}
					onMouseOut={this.onMouseOut}
				/>
				{this.renderToolbar()}
			</div>
		);
	}


	renderToolbar () {
		const {activeControl} = this.state;
		const Control = activeControl && activeControl.Component;

		return (
			<div className="tool-bar">
				{Control && (<Control setEditorState={this.setEditorState} formatting={this.currentFormatting} setActiveControl={this.setActiveControl} />)}
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
