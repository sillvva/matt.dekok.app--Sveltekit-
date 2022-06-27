import type { RequestHandler } from './__types/experience';
import { firestore } from '$lib/firebase/connection.js';

export type ExperienceItem = {
  name?: string;
  nameLink?: string;
  image: string;
  h4: string;
  h4Link?: string;
  h5: string;
  h5Link?: string;
};

export type ExperienceArrSection = {
  name: string;
  experience: ExperienceItem[];
};

type ExperienceSection = {
  [name: string]: ExperienceItem;
};

type ExperienceSections = {
  [name: string]: ExperienceSection;
};

export const get: RequestHandler = async () => {
	const doc = firestore.doc('website/experience');
	const document = await doc.get();
	const experience: ExperienceSections = document.data() || {};

	return {
		body: {
			experience: Object.entries(experience)
				.sort(([nameA], [nameB]) => (nameA > nameB ? 1 : -1))
				.map(([sectionName, section]) => ({
					name: sectionName.replace(/^\d+\. /, ''),
					experience: Object.entries(section)
						.sort(([nameA], [nameB]) => (nameA > nameB ? 1 : -1))
						.map(([expName, exp]) => ({
							name: expName.replace(/^\d+\. /, ''),
							...exp
						}))
				}))
		},
    headers: {
      'Cache-Control': 'public, max-age=86400',
    }
	};
};
