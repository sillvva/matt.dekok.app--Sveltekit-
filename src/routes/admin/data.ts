import type { RequestHandler } from './__types/data';
import { env } from '$lib/constants';
import { supabase } from '$lib/supabase/connection';
import { fetchPosts } from '$lib/supabase/blog';
import type { Admin } from '$lib/store';

export const get: RequestHandler<Admin> = async ({ request, url }) => {
	const token = request.headers.get('authorization')?.replace('Bearer ', '') ?? '';
	const { user } = await supabase.auth.api.getUser(token);
	if (user?.id !== env.AUTH_UID) return getError('Unauthorized', 401);

	const select = url.searchParams.get('select');
	return getResult(select);
};

export type AdminMutation = {
	success: boolean;
	error?: string;
};

export const post: RequestHandler<AdminMutation> = async ({ request, url }) => {
	const token = request.headers.get('authorization')?.replace('Bearer ', '') ?? '';
	const { user } = await supabase.auth.api.getUser(token);
	if (user?.id !== env.AUTH_UID) return getError('Unauthorized', 401);

	const select = url.searchParams.get('select');

	if (select === 'posts') {
		const formData = await request.formData();
		const file = formData.get('file');
		const filename = formData.get('filename')?.toString();

		if (file && filename) {
			const { error } = await supabase.storage.from('blog').upload(filename, file, {
				upsert: true
			});

			if (error) return getError(error);
			else await fetchPosts();
		}
	}

	return {
		status: 200,
		body: {
			success: true
		}
	};
};

export const del: RequestHandler<AdminMutation> = async ({ request, url }) => {
	const token = request.headers.get('authorization')?.replace('Bearer ', '') ?? '';
	const { user } = await supabase.auth.api.getUser(token);
	if (user?.id !== env.AUTH_UID) return getError('Unauthorized', 401);

	const select = url.searchParams.get('select');

	if (select === 'posts') {
		const slug = url.searchParams.get('slug');

		if (slug) {
			const { data } = await supabase.storage.from('blog').list('archive', { search: slug });
			const suffix = data && data.length ? ` (${data.length + 1})` : '';
			const { error } = await supabase.storage
				.from('blog')
				.move(`${slug}.md`, `archive/${slug}${suffix}.md`);
			if (error) return getError(error);
			else await fetchPosts();
		}
	}

	return {
		status: 200,
		body: {
			success: true
		}
	};
};

const getResult = async (select: string | null) => {
	const { data: posts, count: numposts } = await supabase
		.from('blog')
		.select('*', { count: 'exact', head: select === 'posts' ? false : true });

	const { data: experience, count: numexperience } = await supabase
		.from('experience')
		.select('*', { count: 'exact', head: select === 'experience' ? false : true });

	const { data: skills, count: numskills } = await supabase
		.from('skills')
		.select('*', { count: 'exact', head: select === 'skills' ? false : true });

	const { data: projects, count: numprojects } = await supabase
		.from('projects')
		.select('*', { count: 'exact', head: select === 'projects' ? false : true });

	return {
		status: 200,
		body: {
			success: true,
			numposts: numposts || 0,
			posts: posts || [],
			numexperience: numexperience || 0,
			experience: experience || [],
			numskills: numskills || 0,
			skills: skills || [],
			numprojects: numprojects || 0,
			projects: projects || []
		},
		headers: {
			'Cache-Control': 'no-cache'
		}
	};
};

const getError = async (error: Error | string, code = 500) => {
	return {
		status: code,
		body: {
			success: false,
			error: error.toString()
		},
		headers: {
			'Cache-Control': 'no-cache'
		}
	};
};
