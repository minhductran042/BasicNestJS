import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common'
import { PostsService } from './posts.service'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'
import { Auth } from 'src/shared/decorator/auth.decorator'
import { AuthType, ConditionGuard, REQUEST_USER_KEY } from 'src/shared/constants/auth.constant'
import type { Request } from 'express'
import { ActiveUser } from 'src/shared/decorator/active-user.decorator'
import { CreatePostBodyDTO, GetPostItemDTO, UpdatePostDTO } from './post.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  @Get()
  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.Or })
  getPosts(@ActiveUser('userId') userId: number) {
    return this.postService.getPosts(userId).then(posts => posts.map(post => new GetPostItemDTO(post)))
  }

  @Post()
  @Auth([AuthType.Bearer])
  async createPost(@Body() body: CreatePostBodyDTO, @ActiveUser('userId') userId: number) {

    // console.log(userId)
    return new GetPostItemDTO(await this.postService.createPost(body, userId))
  }

  @Get(':id')
  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.Or })
  async getPost(@Param('id') id: string) {
    return new GetPostItemDTO(await this.postService.getPost(Number (id)))
  }

  @Put(':id')
  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.Or })
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostDTO, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(await this.postService.updatePost({
      postId: Number(id),
      body,
      userId
    }))
  }

  @Delete(':id')
  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.Or })
  async deletePost(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(await this.postService.deletePost(Number(id), userId))
  }
}
