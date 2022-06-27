import type { RequestHandler } from './__types/skills';
import { firestore } from '$lib/firebase/connection.js';
import type { Rating } from '$lib/types/rating';

type Skill = {
  [name: string]: number;
};

type SkillSection = {
  [section: string]: Skill;
};

export type SkillPropsSection = {
  name: string;
  skills: Rating[];
};

export const get: RequestHandler = async () => {
	const doc = firestore.doc("website/skills");
  const document = await doc.get();
  const sections: SkillSection = document.data() || {};

  return {
    body: {
      skills: Object.entries(sections)
        .sort((a, b) => (a[0] > b[0] ? 1 : -1))
        .map(([section, skills]) => ({
          name: section.replace(/^\d+\. /, ""),
          skills: Object.entries(skills)
            .map(([skill, rating]) => ({
              name: skill,
              rating: rating
            }))
            .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
        }))
    },
    headers: {
      'Cache-Control': 'public, max-age=86400',
    }
	};
};
