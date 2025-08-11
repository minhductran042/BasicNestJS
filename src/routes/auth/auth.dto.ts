import { Exclude } from "class-transformer"
import { IsDefined, IsEmail, IsString, MinLength } from "class-validator"

export class LoginBodyDto {
    @IsEmail()
    @IsDefined()
    email: string

    @IsString()
    @IsDefined()
    @MinLength(6)
    password: string
}

export class RegisterBodyDto extends LoginBodyDto {
    @IsString()
    @IsDefined()
    name: string

    @IsString()
    @IsDefined()
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