import React from 'react';
import PropTypes from 'prop-types';
import {Loading, Input} from 'nti-web-commons';

import {getImgSrc, drawFromImg} from './utils';

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
			loading: false,
			currentState: {
				image,
				edits: editorState || {}
			}
		};
	}

	componentDidUpdate () {
		this.draw();
	}

	onImgLoad = () => {
		drawFromImg(this.canvas, this.imgRef);
	}

	uploadAssets = (file) => {
		this.setState({loading: true, file});

		getImgSrc(file).then((imgSrc) => {
			this.setState({imgSrc, loading: false});
		});
	}

	draw () {
		const {canvas} = this;
		const {currentState} = this.state;
	}


	render () {
		const {currentState} = this.state;


		if(!this.state.file) {
			return <Input.File className="asset-file" ref={this.attachFileRef} onFileChange={this.uploadAssets}/>;
		}

		if(this.state.loading) {
			return <Loading.Mask/>;
		}

		return (<div className="nti-image-editor">
			<canvas ref={this.setCanvas}/>
			{this.state.imgSrc ? (<img ref={this.attachImgRef} onLoad={this.onImgLoad} src={this.state.imgSrc} style={{display: 'none'}}/>) : null}
		</div>);
	}
}
