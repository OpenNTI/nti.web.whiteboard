import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {getService} from '@nti/web-client';
import {Loading} from '@nti/web-commons';

import Styles from './View.css';
import {getStateForEditor, getIDForEditor} from './types';
import Image from './types/image';
import LinearGradient from './types/linear-gradient';
import SolidColor from './types/solid-color';
import TypeSwitcher from './components/TypeSwitcher';
import EditorBody from './components/EditorBody';

const cx = classnames.bind(Styles);

AssetEditor.Image = Image;
AssetEditor.LinearGradient = LinearGradient;
AssetEditor.SolidColor = SolidColor;
AssetEditor.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any,

	asset: PropTypes.string,
	defaultAsset: PropTypes.string,

	onSave: PropTypes.func,
	onCancel: PropTypes.func
};
export default function AssetEditor ({className, asset, defaultAsset, children}) {
	const [values, setValues] = React.useState(null);
	const [current, setCurrent] = React.useState(null);
	const editors = React.Children.toArray(children);

	React.useEffect(() => {
		async function loadAsset () {
			const toLoad = asset || defaultAsset;
			const didChange = () => toLoad !== (asset || defaultAsset);

			try {
				const service = await getService();
				const raw = await service.get({url: toLoad, headers: null});

				if (didChange()) { return; }

				const initialValues = {};
				let initialType = null;

				for (let editor of editors.reverse()) {
					const id = getIDForEditor(editor);
					const original = getStateForEditor(editor, toLoad, raw);

					if (original) {
						initialValues[id] = original;
						initialType = id;
						break;
					}
				}

				setValues(initialValues);
				setCurrent(initialType);
			} catch (e) {
				if (didChange()) { return; }
				setValues(e);
			}
		}

		loadAsset();
	}, [asset || defaultAsset]);

	return (
		<div className={cx('asset-editor', className)}>
			<Loading.Placeholder loading={!values} fallback={(<Loading.Spinner />)}>
				<div className={cx('navigation')}>
					<TypeSwitcher editors={editors} current={current} setCurrent={setCurrent} />
				</div>
				<form className={cx('body')}>
					<EditorBody values={values} current={current} editors={editors} />
				</form>
			</Loading.Placeholder>
		</div>
	);
}