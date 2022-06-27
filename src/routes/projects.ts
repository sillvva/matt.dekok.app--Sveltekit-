import type { RequestHandler } from './__types/projects';
import { firestore } from '$lib/firebase/connection.js';

export type Project = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link?: string;
  sort?: number;
};

export const get: RequestHandler = async () => {
	const doc = firestore.doc("website/projects");
  const document = await doc.get();
  const projects: Project[] = document.data()?.data || [];

  return {
    body: {
      projects: projects
        .map((p, i) => ({
          ...p,
          sort: i
        }))
        .sort((a, b) => (a.sort < b.sort ? 1 : -1))
    },
    headers: {
      'Cache-Control': 'public, max-age=86400',
    }
	};
};
