export type PostProps = {
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

export type PostData = {
  name: string;
  created_at: string;
  updated_at: string;
  match: number;
} & PostProps;