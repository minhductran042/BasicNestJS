import { Body, ClassSerializerInterceptor, Controller, Post, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterBodyDto, RegisterResDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @SerializeOptions({ type: RegisterResDTO })
    @Post('register')
    async register(@Body() body: RegisterBodyDto) {
        return this.authService.register(body);
    }
    
}
