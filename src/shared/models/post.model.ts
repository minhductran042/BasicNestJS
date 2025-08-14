export class PostModel {
  id: number
  title: string
  content : string
  authorId : number
  createdAt : Date
  updatedAt : Date

  // Relations
  constructor(partial: Partial<PostModel>) {
    Object.assign(this, partial);
  }
}