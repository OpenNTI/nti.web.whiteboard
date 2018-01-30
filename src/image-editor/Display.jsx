import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {Crop, Rotate} from './tools';
import {getLayoutFor} from './utils';

const TOOLS = [
	Crop, Rotate
];

const CANVAS_PADDING = 0;

export default class ImageEditorDisplay extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		editorState: PropTypes.object
	}

	state = {}

	setContainer = x => this.container = x

	setCanvas = canvas => {
		this.canvas = canvas;

		this.draw();
	}

	componentWillReceiveProps (newProps) {
		const {editorState:newState} = newProps;
		const {editorState:oldState} = this.props;

		if (newState !== oldState) {
			this.setupInitialState(newState);
		}
	}

	componentDidMount () {
		const {editorState} = this.props;


		if (editorState) {
			this.setupInitialState(editorState);
		}
	}

	componentDidUpdate (prevProps, prevState) {
		this.draw();
	}

	get size () {
		return {
			width: this.container ? this.container.clientWidth : null,
			height: this.container ? this.container.clientHeight : null
		};
	}

	setEditorState (state) {
		this.setState({
			editorState: state
		});
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

	fixLayout (formatting, layout) {
		let newLayout = {...layout};

		for (let tool of TOOLS) {
			if (tool.output && tool.output.fixLayout) {
				newLayout = tool.output.fixLayout(formatting, newLayout);
			}
		}

		return newLayout;
	}

	setupInitialState (initialState) {
		const {image, formatting} = initialState;

		if (image) {
			const layout = getLayoutFor(image, this.size, CANVAS_PADDING);
			const newFormatting = this.fixFormatting(formatting || {}, layout);
			const newLayout = this.fixLayout(newFormatting || {}, layout);

			this.setEditorState({
				image,
				formatting: newFormatting,
				layout: newLayout
			});
		} else if (formatting) {
			this.setEditorState({
				formatting
			});
		}
	}


	draw () {
		const {editorState} = this.state;

		if (!this.canvas || !editorState) { return; }

		const ctx = this.canvas.getContext('2d');
		const {layout} = editorState;

		//reset the canvas
		this.canvas.width = layout.canvas.width;
		this.canvas.height = layout.canvas.height;

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.lineWidth = 1;

		ctx.save();
		ctx.drawImage(layout.image.src, layout.image.x, layout.image.y, layout.image.width, layout.image.height);
		ctx.restore();
	}


	render () {
		const {className, ...otherProps} = this.props;
		const {editorState} = this.state;
		const {layout} = editorState || {};

		delete otherProps.editorState;

		const styles = layout && {width: `${layout.canvas.width}px`, height: `${layout.canvas.height}px`};

		return (
			<div className={cx('nti-image-editor-display', className)} {...otherProps} ref={this.setContainer}>
				<div className="canvas-container" style={styles}>
					{editorState && (<canvas ref={this.setCanvas} width={5} height={3} />)}
				</div>
			</div>
		);
	}
}
