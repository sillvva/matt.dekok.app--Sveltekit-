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

export interface HexMenuItem {
  link: string;
  label: string;
  active?: boolean;
  color?: string;
  hoverColor?: string;
  activeColor?: string;
  textColor?: string;
};

export interface Rating {
  name: string;
  rating: number;
};

export interface Image {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  copied?: boolean;
  metadata: {
    size?: number;
    mimetype?: string;
    cacheControl?: string;
  }
}

export interface Admin {
  success: boolean;
  error?: string;
  numposts?: number;
  posts?: PostData[];
  numimages?: number;
  images?: Image[];
  numexperience?: number;
  experience?: any[];
  numskills?: number;
  skills?: Rating[];
  numprojects?: number;
  projects?: any[];
};

export interface PageQuery {
  page: number;
  query: string;
}

export interface PageProps {
  title?: string;
  description?: string;
  bodyClass?: string;
  backTo?: boolean | string;
  menu?: boolean;
  articleMeta?: {
    published_date?: string;
    modified_date?: string;
  };
  image?: string;
}

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link?: string;
  created_at: string;
};

export interface SkillSection {
  name: string;
  skills: Rating[];
  sort: number;
};

export interface ExperienceItem {
  name?: string;
  nameLink?: string;
  image: string;
  h4: string;
  h4Link?: string;
  h5: string;
  h5Link?: string;
  created_at: string;
}

export interface ExperienceSection {
  name: string;
  experience: ExperienceItem[];
  sort: number;
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}
