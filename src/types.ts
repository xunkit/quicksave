export interface List {
  id: string;
  name: string;
  userId: string;
  bookmarks: Array<Bookmark>;
}

export interface Bookmark {
  title: string;
  description: string;
  imageSrc: string;
  url: string;
  parentSite: string;
  id: number;
}

export interface ActionState {
  success: true | false;
  errors?: string[];
  message?: string;
}
