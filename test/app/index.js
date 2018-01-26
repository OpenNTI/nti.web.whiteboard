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
class Test extends React.Component {
	componentDidMount () {

	}

	constructor (props) {
		super(props);
	}

	onClick = () => {
		Prompt.modal(<ImageEditor/>);
	}

	render () {
		return (<div className="launch" onClick={this.onClick}>Launch</div>);
	}
}


ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
