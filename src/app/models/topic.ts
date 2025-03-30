import { Post } from './post';

export interface Topic {
  id: string;
  name: string;
  posts: Post[];
  author: string;
  timecreated: string;
  readers: string[];
  editors: string[];
  isOwner?: boolean;
  isReader?: boolean;
  isWriter?: boolean;
}

export type Topics = Topic[];
