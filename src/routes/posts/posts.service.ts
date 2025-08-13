import { Body, Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service'
import envConfig from 'src/shared/config';

@Injectable()
export class PostsService {

  constructor(private readonly prismaService: PrismaService) {}

  async getPosts() {
    return this.prismaService.post.findMany()
  }

  createPost(body: any, userId: number): any {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      }
    });
  }

  async getPost(id: string) {
    const post = await this.prismaService.post.findFirst({
      where: { id: parseInt(id) }
    });
    
    return post;
  }

  updatePost(id: string, body: any): any {
    return `Update post with ID ${id} with data: ${JSON.stringify(body)}`
  }

  deletePost(id: string): string {
    return `Post with ID ${id} deleted`
  }
}
