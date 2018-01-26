import React from 'react';
import PropTypes from 'prop-types';

import Upload from './Upload';

export default class ImageEditor extends React.Component {
	static propTypes = {
		image: PropTypes.any,
		editorState: PropTypes.object
	}

	attachImgRef = x => this.imgRef = x
	attachFileRef = x => this.fileInput = x



	setCanvas = x => {
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

	onImgChange = (img) => {
		this.setState({hasImage: true});

		const { canvas } = this;
		const ctx = canvas.getContext('2d');

		const { width, height } = img;

		const ratio = height / width;

		canvas.width = 800;
		canvas.height = ratio * canvas.width;

		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	}


	render () {
		const {currentState} = this.state;

		if(!this.state.hasImage) {
			return <Upload onChange={this.onImgChange}/>;
		}

		return (<div className="nti-image-editor">
			<canvas ref={this.setCanvas}/>
		</div>);
	}
}
