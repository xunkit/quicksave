export interface Bookmark {
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  parentSite: string;
  id: number;
}

export interface ActionState {
  success: true | false;
  errors?: string[];
  message?: string;
}
