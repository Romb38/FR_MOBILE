export interface Post {
  id: string,
  name: string,
  description: string,
  author: string,
  timecreated: string,
  timemodified: string | null,
}

export type Posts = Post[];
