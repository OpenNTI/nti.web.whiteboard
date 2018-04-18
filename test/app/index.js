import React from 'react';
import ReactDOM from 'react-dom';

// import Whiteboard from '../../src/index';
import {Editor, getImageForEditorState} from '../../src/image-editor';

import '@nti/style-common/all.scss';
import '@nti/web-commons/lib/index.css';

// ReactDOM.render(
// 	React.createElement(Whiteboard, {}),
// 	document.getElementById('content')
// );

const formatting = {
	crop: {
		width: 200,
		height: 300
	},
	blur: {
		radius: 50
	}
};

class Test extends React.Component {
	state = {}

	onChange = async (editorState) => {
		const img = await getImageForEditorState(editorState);

		this.setState({
			src: img.src
		});
	}

	render () {
		const {src} = this.state;

		return (
			<div>
				<div>
					<h1>Editor</h1>
					<Editor editorState={{formatting}} onChange={this.onChange}/>
				</div>
				<div>
					<h1>Display</h1>
					{src && (<img src={src} style={{margin: '0 auto', display: 'block', border: '1px solid red'}}/>)}
				</div>
			</div>
		);
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
