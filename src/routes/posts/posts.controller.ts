import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { PostsService } from './posts.service'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'
import { Auth } from 'src/shared/decorator/auth.decorator'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  @Get()
  // @UseGuards(AccessTokenGuard)
  // @UseGuards(ApiKeynGuard)

  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.Or })
  // @UseGuards(AuthenticationGuard)
  getPosts() {
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
