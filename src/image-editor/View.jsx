import React from 'react';
import PropTypes from 'prop-types';

export default class ImageEditor extends React.Component {
	static propTypes = {
		image: PropTypes.any,
		editorState: PropTypes.object
	}


	setCanvas = x => {
		this.canvas = x;
		this.draw();
	}


	constructor (props) {
		super(props);

		const {editorState, image} = this.props;

		this.state = {
			currentState: {
				image,
				edits: editorState || {}
			}
		};
	}


	componentDidUpdate () {
		this.draw();
	}


	draw () {
		const {canvas} = this;
		const {currentState} = this.state;
	}


	render () {
		const {currentState} = this.state;



		return (
			<div className="nti-image-editor">
				<canvas ref={this.setCanvas} />
			</div>
		);
	}
}
