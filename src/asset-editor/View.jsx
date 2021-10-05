import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { getService } from '@nti/web-client';
import { Loading } from '@nti/web-commons';
import { useReducerState } from '@nti/web-core';

import Styles from './View.css';
import {
	getStateForEditor,
	getIDForEditor,
	getEditorByID,
	getPayloadForEditor,
} from './types';
import Image from './types/image';
import LinearGradient from './types/linear-gradient';
import SolidColor from './types/solid-color';
import TypeSwitcher from './components/TypeSwitcher';
import EditorBody from './components/EditorBody';
import Controls from './components/Controls';

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
	onCancel: PropTypes.func,
};
export default function AssetEditor({
	className,
	asset,
	defaultAsset,
	children,
	onSave,
	onCancel,
}) {
	const [{ values, current, saving, savingError }, _set] = useReducerState({
		values: null,
		current: null,
		saving: false,
		savingError: null,
	});

	const hasUpdated = values && values[current] && values[current].updated;

	const editors = React.Children.toArray(children);

	let locked = false;
	useEffect(() => () => (locked = true), []);
	const set = useCallback(x => !locked && _set(x), []);

	useEffect(() => {
		async function loadAsset() {
			const toLoad = asset || defaultAsset;
			const didChange = () => toLoad !== (asset || defaultAsset);

			try {
				const service = await getService();
				const raw = toLoad
					? await service.get({ url: toLoad, headers: null })
					: null;

				if (didChange()) {
					return;
				}

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

				set({ values: initialValues, current: initialType });
			} catch (e) {
				if (didChange()) {
					return;
				}
				set({ values: e });
			}
		}

		loadAsset();
	}, [asset || defaultAsset]);

	const onSubmit = async e => {
		e.preventDefault();
		e.stopPropagation();

		if (!hasUpdated || saving) {
			return;
		}

		const editor = getEditorByID(editors, current);
		const value = values[current];

		set({ saving: true });

		try {
			const payload = await getPayloadForEditor(editor, value);
			await onSave(payload);
		} catch (err) {
			set({ savingError: err });
		} finally {
			set({ saving: false });
		}
	};

	return (
		<div className={cx('asset-editor', className)}>
			<Loading.Placeholder
				loading={!values}
				fallback={<Loading.Spinner />}
			>
				<div className={cx('navigation')}>
					<TypeSwitcher
						editors={editors}
						current={current}
						setCurrent={current => set({ current })}
					/>
				</div>
				<form className={cx('body')} onSubmit={onSubmit}>
					<EditorBody
						values={values}
						current={current}
						editors={editors}
						setValues={values => set({ values })}
						savingError={savingError}
						setSavingError={e => set({ savingError: e })}
					/>
					<Controls
						values={values}
						current={current}
						saving={saving}
						cancel={onCancel}
						editors={editors}
					/>
				</form>
			</Loading.Placeholder>
		</div>
	);
}
