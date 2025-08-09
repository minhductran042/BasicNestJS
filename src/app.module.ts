import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [AppController, PostsController],
  providers: [AppService],
})
export class AppModule {}
