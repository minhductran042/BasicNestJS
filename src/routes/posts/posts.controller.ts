import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common'
import { PostsService } from './posts.service'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'
import { Auth } from 'src/shared/decorator/auth.decorator'
import { AuthType, ConditionGuard, REQUEST_USER_KEY } from 'src/shared/constants/auth.constant'
import type { Request } from 'express'
import { ActiveUser } from 'src/shared/decorator/active-user.decorator'

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  @Get()
  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.Or })
  getPosts() {
    return this.postService.getPosts()
  }

  @Post()
  @Auth([AuthType.Bearer])
  createPost(@Body() body: any, @ActiveUser('userId') userId: number): any {

    // console.log(userId)
    return this.postService.createPost(body, userId)
  }

  @Get(':id')
  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.Or })
  getPost(@Param('id') id: string): any {
    return this.postService.getPost(id)
  }

  @Put(':id')
  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.Or })
  updatePost(@Param('id') id: string, @Body() body: any): any {
    return 'Update post with ID ${id} with data: ${JSON.stringify(body)}'
  }

  @Delete(':id')
  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.Or })
  deletePost(@Param('id') id: string): string {
    return this.postService.deletePost(id)
  }
}
