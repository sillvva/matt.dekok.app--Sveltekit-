import type { RequestHandler } from './__types/data';
import { env } from '$lib/constants';
import { supabase } from '$lib/supabase/connection';
import { fetchPosts } from '$lib/supabase/blog';

export const get: RequestHandler<any> = async ({ request, url }) => {
	const token = request.headers.get('authorization')?.replace('Bearer ', '');
	const { user } = await supabase.auth.api.getUser(token || '');
	if (user?.id !== env.AUTH_UID) return getError('Unauthorized', 401);

	const select = url.searchParams.get('select');
	return getResult(select);
};

export const post: RequestHandler<any> = async ({ request, url }) => {
	const token = request.headers.get('authorization')?.replace('Bearer ', '');
	const { user } = await supabase.auth.api.getUser(token || '');
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

	return getResult(select);
};

export const del: RequestHandler<any> = async ({ request, url }) => {
	const token = request.headers.get('authorization')?.replace('Bearer ', '');
	const { user } = await supabase.auth.api.getUser(token || '');
	if (user?.id !== env.AUTH_UID) return getError('Unauthorized', 401);

	const select = url.searchParams.get('select');

	if (select === 'posts') {
		const slug = url.searchParams.get('slug');

		if (slug) {
			const { error } = await supabase.storage.from('blog').remove([`${slug}.md`]);
			if (error) return getError(error);
			else await fetchPosts();
		}
	}

	return getResult(select);
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
			numposts,
			posts,
			numexperience,
			experience,
			numskills,
			skills,
			numprojects,
			projects
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
			error: error.toString()
		},
		headers: {
			'Cache-Control': 'no-cache'
		}
	};
};
