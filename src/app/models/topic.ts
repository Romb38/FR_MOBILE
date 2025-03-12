import { Post } from "./post";

export interface Topic {
  id : string,
  name : string,
  posts : Post[],
  author : string,
  reader : string[],
  editor : string[],
}

export type Topics = Topic[];
