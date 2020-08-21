import './Upload.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
// import {Input} from '@nti/web-commons';

import {getImgSrc} from './utils';

const DEFAULT_TEXT = {
	title: 'Drag an Image to Upload, or',
	choose: 'Choose a File',
	requirements: 'Must be a .jpg or a .png under 10MB.',
	wrongType: 'File type is unsupported.',
	tooLarge: 'File is too large.',
	unknownError: 'Unable to upload file.'
};
const t = scoped('web-whiteboard.image-editor.Upload', DEFAULT_TEXT);

const ALLOWED_TYPES = {
	'image/png': true,
	'image/jpeg': true
};

const SIZE_LIMIT = 10 * 1024 * 1024;

export default class Upload extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired
	}
	state = { loading: false }
	input = React.createRef()

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

	loadFile (file) {
		const {onChange} = this.props;

		if (!file) { return; }

		if (!ALLOWED_TYPES[file.type]) {
			this.setState({
				error: t('wrongType')
			});
			return;
		}

		if (file.size > SIZE_LIMIT) {
			this.setState({
				error: t('tooLarge')
			});
			return;
		}

		this.setState({
			error: null,
			loading: true
		}, async () => {
			try {
				const src = await getImgSrc(file);
				const img = new Image();

				img.onload = () => {
					img.setAttribute('data-file-id', `${file.name}-${file.lastModified}`);

					this.setState({loading: false, error: null});

					if (onChange) {
						onChange(img, file.name);
					}
				};

				img.src = src;
			} catch (err) {
				this.setState({loading: false, error: t('unknownError')});
			}
		});
	}


	onFileChange = (e) => {
		e.preventDefault();

		const files = e.target.files;
		const file = files && files[0];

		this.loadFile(file);
	}


	handleDragOver = (e) => (e.stopPropagation(), e.preventDefault())
	onDrop = (e) => {
		e.preventDefault();

		const {dataTransfer} = e.nativeEvent;
		const files = dataTransfer && dataTransfer.files;

		this.loadFile(files[0]);
	}

	render () {
		const {error, loading} = this.state;

		return (
			<div className={cx('nti-image-editor-upload', {loading})} onDragOver={this.handleDragOver} onDrop={this.onDrop}>
				<input type="file" className="asset-file" onChange={this.onFileChange} ref={this.input}/>
				<div className="container">
					<i className="icon-upload" />
					<span className="title">{t('title')}</span>
					<div className="choose-container"><span className="choose">{t('choose')}</span></div>
					<div className={cx('error-container', {error})}>
						<span className="error">{error || 'no error'}</span>
					</div>
					<span className="requirements">{t('requirements')}</span>
				</div>
			</div>
		);
	}
}
