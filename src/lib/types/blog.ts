export interface PostProps {
  slug: string;
  title: string;
  date: string;
  dateISO?: string;
  updated?: string;
  updatedISO?: string;
  description?: string;
  tags: string[];
  image: string;
  link?: string;
  full?: boolean;
};

export interface PostData extends PostProps {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  match: number;
};
