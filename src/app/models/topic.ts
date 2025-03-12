import { Post } from "./post";

export interface Topic {
  id : string,
  name : string,
  posts : Post[],
  author : string,
}

export type Topics = Topic[];
