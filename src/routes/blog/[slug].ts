import type { RequestHandler } from './__types/[slug]';

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params;
	return {
		status: 200,
		body: {
			slug,
		}
	}
};
