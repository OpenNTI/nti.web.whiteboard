import React from 'react';
import PropTypes from 'prop-types';
import {Loading, Input} from 'nti-web-commons';

import {getImgSrc} from './utils';

export default class Upload extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired
	}

	attachImgRef = x => this.imgRef = x
	attachFileRef = x => this.fileInput = x

	state = { loading: false }

	uploadAssets = (file) => {
		const { onChange } = this.props;

		this.setState({loading: true, file});

		getImgSrc(file).then((imgSrc) => {
			const img = new Image();
			img.onload = () => {
				this.setState({loading: false});
				onChange && onChange(img);
			};

			img.src = URL.createObjectURL(file);
		});
	}

	render () {
		if(this.state.loading) {
			return <Loading.Mask/>;
		}

		return <Input.File className="asset-file" ref={this.attachFileRef} onFileChange={this.uploadAssets}/>;
	}
}
