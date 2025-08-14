import { Body, ClassSerializerInterceptor, Controller, HttpCode, HttpStatus, Post, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto, LoginResDTO, LogoutBodyDTO, LogoutResDTO, RefreshTokenDTO, RefreshTokenResDTO, RegisterBodyDto, RegisterResDTO } from './auth.dto';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: RegisterBodyDto) {
        const user =  await this.authService.register(body)
        return new RegisterResDTO(user)
    }

    @Post('login')
    async login(@Body() body: LoginBodyDto) {
        return new LoginResDTO(await this.authService.login(body))
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() body: RefreshTokenDTO) {
        return new RefreshTokenResDTO(await this.authService.refreshToken(body.refreshToken))
    }

    @Post('logout')
    async logout(@Body() body: LogoutBodyDTO) {
        return new LogoutResDTO( await this.authService.logout(body.refreshToken));
    }
}
