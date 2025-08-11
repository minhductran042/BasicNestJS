import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { HashingService } from '../../shared/services/hashing.service';
import { Prisma } from '../../../generated/prisma';
import { TokenService } from 'src/shared/services/token.service';
import { LoginBodyDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly hashingService: HashingService,
        private readonly tokenService: TokenService
    ) {}

    async register(body: any) {
        try {
            const hashedPassword = await this.hashingService.hash(body.password);
            const user = await this.prismaService.user.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                    name: body.name
                }
            })
            return user
        } catch (error) {
           if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Email already exists');
                }
            }
            throw error
        }
    }

    async login(body: LoginBodyDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email,
            }
        })
        if(!user) {
            throw new UnauthorizedException('Account does not exist')
        }

        const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
        if(!isPasswordMatch) {
            throw new UnprocessableEntityException([
                {
                    field: 'password',
                    error: 'Incorrect password'
                }
            ])
        }
        const tokens = await this.generateTokens({ userId: user.id });
        return tokens;
    }

    async generateTokens(payload: { userId: number }) {
        const [acccessToken, refreshToken] = await Promise.all([
            this.tokenService.signAccessToken(payload),
            this.tokenService.signRefreshToken(payload)
        ]);

        const decodeRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
        await this.prismaService.refreshToken.create({
            data: {
                token: refreshToken,
                userId: payload.userId,
                expiresAt: new Date(decodeRefreshToken.exp * 1000) // Chuyển đổi giây sang mili giây
            }
        });
        return {
            accessToken: acccessToken,
            refreshToken: refreshToken
        }
    }
}
