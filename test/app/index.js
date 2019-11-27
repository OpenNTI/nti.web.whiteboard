import React from 'react';
import ReactDOM from 'react-dom';

// import Whiteboard from '../../src/index';
import {Editor, getImageForEditorState} from '../../src/image-editor';

// ReactDOM.render(
// 	React.createElement(Whiteboard, {}),
// 	document.getElementById('content')
// );

const formatting = {
	crop: {
		width: 70,
		height: 70,
		minSize: {
			height: 70,
			width: 70
		},
		maxSize: {
			height: 70,
			width: 300
		}
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
