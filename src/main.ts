import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
   app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Tự động loại bỏ các thuộc tính không được định nghĩa trong DTO
    transform: true, // Cho phép transform objects
    exceptionFactory: (ValidationError) => {
      return new UnprocessableEntityException(ValidationError.map(error => ({
        property: error.property,
        error: Object.values(error.constraints as any).join(', '),
      })));
    },
   }
   ));
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
