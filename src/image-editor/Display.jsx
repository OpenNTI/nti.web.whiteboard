import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {Crop, Rotate} from './tools';

const TOOLS = [
	Crop, Rotate
];

export default class ImageEditorDisplay extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		editorState: PropTypes.object
	}

	componentDidUpdate (prevProps, prevState) {
		this.draw();
	}


	setCanvas = canvas => {
		this.canvas = canvas;

		this.draw();
	}


	draw (props = this.props) {
		const {editorState} = props;

		if (!this.canvas || !editorState) { return; }

		const ctx = this.canvas.getContext('2d');
		const {layout, formatting} = editorState;
		let displayLayout = layout;

		for (let tool of TOOLS) {
			if (tool.fixLayoutForOutput) {
				displayLayout = tool.fixLayoutForOutput(displayLayout, formatting);
			}
		}

		//reset the canvas
		this.canvas.width = displayLayout.canvas.width;
		this.canvas.height = displayLayout.canvas.height;

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.lineWidth = 1;

		ctx.save();
		ctx.drawImage(displayLayout.image.src, displayLayout.image.x, displayLayout.image.y, displayLayout.image.width, displayLayout.image.height);
		ctx.restore();
	}


	render () {
		const {editorState, className, ...otherProps} = this.props;
		const {layout} = editorState || {};

		const styles = layout && {width: `${layout.canvas.width}px`, height: `${layout.canvas.height}px`};

		return (
			<div {...otherProps} className={cx('image-editor-display', className)} style={styles}>
				{editorState && (<canvas ref={this.setCanvas} width={5} height={3} />)}
			</div>
		);
	}
}
