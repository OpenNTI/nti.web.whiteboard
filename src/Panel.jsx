import React from 'react';
import {Canvas as WhiteboardRenderer} from 'nti-lib-whiteboardjs';
import {URL} from 'nti-lib-dom';
import {Constants} from 'nti-web-commons';

const {DataURIs: {BLANK_IMAGE}} = Constants;


export default React.createClass({
	displayName: 'WhiteboardPanel',

	propTypes: {
		scene: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {
			src: BLANK_IMAGE
		};
	},


	updateRender (scene) {
		let {src} = this.state;
		if (src) {
			URL.revokeObjectURL(src);
		}

		WhiteboardRenderer.getThumbnail(scene)
			.then(blob=> URL.createObjectURL(blob))
			.then(url=> this.setState({src: url}));
	},


	componentDidMount () {
		this.updateRender(this.props.scene);
	},


	componentWillReceiveProps (nextProps) {
		this.updateRender(nextProps.scene);
	},


	componentWillUnmount () {
		URL.revokeObjectURL(this.state.src || '');
	},

	render () {

		return (
			<div className="whiteboard thumbnail">
				<img src={this.state.src} alt="Whiteboard Thumbnail" className="whiteboard-thumbnail"/>
			</div>
		);
	}
});
