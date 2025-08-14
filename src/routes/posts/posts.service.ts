import { Body, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service'
import envConfig from 'src/shared/config';
import { CreatePostBodyDTO, UpdatePostDTO } from './post.dto';

@Injectable()
export class PostsService {

  constructor(private readonly prismaService: PrismaService) {}

  async getPosts(userId: number) {
    return this.prismaService.post.findMany({
      where: {
        authorId: userId
      },
      include: {
        author: {
          omit: {
            password: true
          }
        }
      }

    })
  }

  createPost(body: CreatePostBodyDTO, userId: number): any {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId, 
      },
      include: {
        author: {
          omit: {
            password: true
          }
        }
      }
    });
  }

  async getPost(id: number) {
    return this.prismaService.post.findUniqueOrThrow({
      where: {
        id : id 
      },
      include: {
        author: {
          omit: {
            password: true
          }
        }
      }

    })
  }

  async updatePost({ postId, body, userId }: { postId: number, body: UpdatePostDTO, userId: number }) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId, authorId: userId }
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.prismaService.post.update({
      where: { id: postId },
      data: {
        ...body
      },
      include: {
        author: {
          omit: {
            password: true
          }
        }
      }
    })
  }

  async deletePost(id: number, userId: number) {

    const post = await this.prismaService.post.findUnique({
      where: { id, authorId: userId }
    })

    if(!post) {
      throw new NotFoundException('Post not found');
    }
    
    return this.prismaService.post.delete({
      where: {
        id: id
      }
    })
  }
}
