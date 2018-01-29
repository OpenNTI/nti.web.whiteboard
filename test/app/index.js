import React from 'react';
import ReactDOM from 'react-dom';
import {Prompt} from 'nti-web-commons';

// import Whiteboard from '../../src/index';
import ImageEditor from '../../src/image-editor';

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
	componentDidMount () {

	}

	constructor (props) {
		super(props);
	}

	onClick = () => {
		Prompt.modal(<ImageEditor formatting={formatting}/>);
	}

	render () {
		return (<div className="launch" onClick={this.onClick}>Launch</div>);
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
