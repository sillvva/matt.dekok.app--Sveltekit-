export interface HexMenuItem {
  link: string;
  label: string;
  active?: boolean;
  color?: string;
  hoverColor?: string;
  activeColor?: string;
  textColor?: string;
};

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
