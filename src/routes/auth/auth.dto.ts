import { Exclude } from "class-transformer"
import { IsDefined, IsEmail, IsString, MinLength } from "class-validator"
import { Match } from "src/shared/decorator/custom-validator.decorator"

export class LoginBodyDto {
    @IsEmail()
    @IsDefined()
    email: string

    @IsString()
    @IsDefined()
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    password: string
}

export class RegisterBodyDto extends LoginBodyDto {
    @IsString()
    @IsDefined()
    name: string

    @IsString()
    @IsDefined()
    @Match('password')
    confirmPassword: string
}

export class RegisterResDTO {
   id: number
   name: string
   email: string
   @Exclude()
   password: string
   createdAt: Date
   updatedAt: Date

   constructor(partial: Partial<RegisterResDTO>) {
    Object.assign(this, partial);
  }
}

export class LoginResDTO {
    accessToken: string 
    refreshToken: string

    constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial);
  }
}

export class RefreshTokenDTO {
  @IsString()
  refreshToken: string
}

export class RefreshTokenResDTO extends LoginResDTO {}