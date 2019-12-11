import {Stores} from '@nti/lib-store';
import {getService} from '@nti/web-client';

import Types from './types/Data';

export default class AssetEditorStore extends Stores.BoundStore {
	static syncAssets (community) {
		return community.save({backgroundURL: null});
	}

	async load () {
		if (this.assetURL === this.binding.assetURL) { return; }

		const assetURL = this.assetURL = this.binding.assetURL;
		const aspectRatio = this.aspectRatio = this.binding.aspectRatio;
		const format = this.format = this.binding.format;

		this.set({
			loading: true,
			error: null,
			assetURL,
			aspectRatio,
			format,
			values: {}
		});

		try {
			const service = await getService();
			const raw = await service.get(assetURL);

			for (let Type of Types) {
				const state = Type.getAssetState && Type.getAssetState(assetURL, raw);

				if (state) {
					this.set({
						loading: false,
						current: Type.Name,
						values: {
							[Type.Name]: state
						}
					});
					return;
				}
			}

			throw new Error('Unknown Asset Type');
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}

	setCurrent (current) {
		this.set({current, error: null});
	}

	setValue (type, value) {
		const values = this.get('values');
		const prev = values[type];

		this.setImmediate({
			error: null,
			values: {
				...values,
				[type]: {
					...prev,
					updated: value
				}
			}
		});
	}


	cancel () {
		if (this.binding.onCancel) {
			this.binding.onCancel();
		}
	}


	async save () {
		const current = this.get('current');
		const values = this.get('values');

		const toSave = values[current];

		if (!toSave) { return; }

		try {
			for (let Type of Types) {
				if (Type.Name === current && Type.getPayload) {
					this.set({saving: true});

					const payload = await Type.getPayload(values[current], this.aspectRatio);

					if (this.binding.onSave) {
						await this.binding.onSave(payload);
					}


					this.set({saving: false});
				}
			}

			throw new Error('Unknown Asset Type');
		} catch (e) {
			this.set({
				saving: false,
				error: e
			});
		}
	}
}