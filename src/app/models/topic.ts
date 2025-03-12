import { Post } from "./post";

export interface Topic {
  id : string,
  name : string,
  posts : Post[],
  author : string,
  readers : string[],
  editors : string[],
}

export type Topics = Topic[];
