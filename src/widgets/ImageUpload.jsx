import './ImageUpload.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {RemoveButton} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import {ImageEditor} from '../';

import EditImage from './EditImage';

const t = scoped('whiteboard.widgets.ImageUpload', {
	addAnImage: 'Add an Image'
});

export default class ImageUpload extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		img: PropTypes.object
	}

	state = {}

	componentDidMount () {
		const {img} = this.props;

		if(img) {
			this.setState({img});
		}
	}

	onImageUpload = async (editorState) => {
		const img = await ImageEditor.getImageForEditorState(editorState);

		this.setState({editorState: img}, () => {
			// match aspectRatio to the dimensions of the image in event overview list items
			EditImage.show(ImageEditor.getEditorState(img, {crop: {aspectRatio: 208 / 117, width: img.naturalWidth, height: img.naturalHeight}})).then((newEditorState) => {
				ImageEditor.getImageForEditorState(newEditorState).then(newImg => {
					this.onImageCropperSave(newImg, newEditorState);
				});
			}).catch(() => {
				this.setState({editorState: null});
			});
		});
	}

	onImageCropperSave = async (img, croppedImageState) => {
		this.setState({img, croppedImageState});

		const blob = await this.getBlobForImage();

		this.props.onChange(blob);
	}

	renderImg () {
		if(!this.state.img && !this.state.editorState) {
			return (
				<div className="image-upload-container">
					<ImageEditor.Editor onChange={this.onImageUpload}/>
					<div className="content">
						<i className="icon-upload"/>
						<div className="text">{t('addAnImage')}</div>
					</div>
				</div>
			);
		}

		if(this.state.img) {
			return (
				<div className="image-preview">
					<img src={this.state.img.src}/>
					<div className="remove-image">
						<RemoveButton onRemove={() => {
							this.setState({img: null, editorState: null});

							this.props.onChange(null);
						}}/>
					</div>
				</div>
			);
		}
	}

	async getBlobForImage () {
		const {croppedImageState, img} = this.state;

		const request = croppedImageState ? ImageEditor.getBlobForEditorState(croppedImageState) : Promise.resolve();

		const dataBlob = await request;
		let blobValue = null;

		if(img && !dataBlob) {
			blobValue = undefined; // an image was provided, but no changes were made
		}
		else {
			blobValue = dataBlob || null;
		}

		return blobValue;
	}

	render () {
		return <div className="nti-image-upload">{this.renderImg()}</div>;
	}
}
