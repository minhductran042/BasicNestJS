//Kiem tra xem co file env khong 
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({
    path: '.env',
})


if(!fs.existsSync(path.resolve('.env'))) {
    console.log('Environment file found.')
    process.exit(1)
}

// Đọc file env
class ConfigSchema {
    @IsString()
    DATABASE_URL: string
    @IsString()
    ACCESS_TOKEN_SECRET: string
    @IsString()
    ACCESS_TOKEN_EXPIRES_IN: string
    @IsString()
    REFRESH_TOKEN_SECRET: string    
    @IsString()
    REFRESH_TOKEN_EXPIRES_IN: string
    @IsString()
    SECRET_API_KEY: string
}

const configServer =  plainToInstance(ConfigSchema, process.env);
const e = validateSync(configServer)
if(e.length > 0) {
    console.log('Invalid environment variables:', e);
    const errorMessages = e.map(err => {
        return {
            property: err.property,
            constraints: err.constraints,
            value: err.value
        }
    })
    throw errorMessages
}

const envConfig = configServer

export default envConfig