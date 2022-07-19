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

export interface PageQuery {
  page: number;
  query: string;
}

export interface PageProps {
  title?: string;
  description?: string | null;
  bodyClass?: string;
  backTo?: boolean | string;
  menu?: boolean;
  articleMeta?: {
    published_date?: string | null;
    modified_date?: string | null;
  };
  image?: string;
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}
