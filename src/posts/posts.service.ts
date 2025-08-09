import { Body, Injectable } from '@nestjs/common'

@Injectable()
export class PostsService {
  getPosts(): string {
    return 'This action returns all posts'
  }

  createPost(body: any): any {
    return body
  }

  getPost(id: string): any {
    return `Post with ID ${id}`
  }

  updatePost(id: string, body: any): any {
    return `Update post with ID ${id} with data: ${JSON.stringify(body)}`
  }

  deletePost(id: string): string {
    return `Post with ID ${id} deleted`
  }
}
