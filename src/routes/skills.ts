import type { RequestHandler } from './__types/skills';
import { supabase } from '$lib/supabase/connection';
import type { Rating } from '$lib/types/rating';

export type SkillSection = {
	name: string;
	skills: Rating[];
	sort: number;
};

export const get: RequestHandler = async () => {
	const { data } = await supabase
		.from('skill_categories')
		.select('name, skills ( name, rating ), sort');
	let skills: SkillSection[] =
		data?.sort((a: SkillSection, b: SkillSection) => (a.sort > b.sort ? 1 : -1)) || [];
	skills = skills.map((section) => ({
		...section,
		skills: section.skills.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
	}));

	return {
		body: {
			skills
		},
		headers: {
			'Cache-Control': 'public, max-age=86400'
		}
	};
};
