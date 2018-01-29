import React from 'react';
import ReactDOM from 'react-dom';

// import Whiteboard from '../../src/index';
import {Editor, Display} from '../../src/image-editor';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';

// ReactDOM.render(
// 	React.createElement(Whiteboard, {}),
// 	document.getElementById('content')
// );

const formatting = {
	crop: {
		width: 200,
		height: 300,
		aspectRatio: 2 / 3
	}
};

class Test extends React.Component {
	state = {}

	onChange = (editorState) => {
		debugger;
		this.setState({
			editorState
		});
	}

	render () {
		const {editorState} = this.state;

		return (
			<div>
				<div>
					<h1>Editor</h1>
					<Editor formatting={formatting} onChange={this.onChange}/>
				</div>
				<div>
					<h1>Display</h1>
					{editorState && (<Display editorState={editorState} />)}
				</div>
			</div>
		);
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
