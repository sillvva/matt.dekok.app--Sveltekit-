export const get: RequestHandler = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || blogPostsPerPage.toString());
	const query = url.searchParams.get('q') || '';

	try {
		const result = await getPosts({ page, query, limit });
		if (result.pages < page) throw new Error('Invalid page count');
		return {
			status: 200,
			body: {
				...result
			},
			headers: {
				'Cache-Control': 'public, max-age=21600'
			}
		};
	} catch (err: any) {
		return {
			status: 200,
			body: {
				error: {
					message: err.message
				}
			},
			headers: {
				'Cache-Control': 'no-cache'
			}
		};
	}
};
