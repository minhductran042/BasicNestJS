import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  @Get()
  getPosts(): string {
    return this.postService.getPosts()
  }

  @Post()
  createPost(@Body() body: any): any {
    return this.postService.createPost(body)
  }

  @Get(':id')
  getPost(@Param('id') id: string): any {
    return this.postService.getPost(id)
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() body: any): any {
    return this.postService.createPost({ ...body, id })
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): string {
    return this.postService.deletePost(id)
  }
}
