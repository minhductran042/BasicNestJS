import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthType, ConditionGuard, REQUEST_USER_KEY } from '../constants/auth.constant';
import envConfig from '../config';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPES_KEY, AuthTypeDecoratorPayload } from '../decorator/auth.decorator';
import { AccessTokenGuard } from './access-token.guard';
import { ApiKeyGuard } from './api-key.guard';

const SECRET_KEY = envConfig.SECRET_API_KEY;

@Injectable()
export class AuthenticationGuard implements CanActivate {
    private authTypeGuardMap: Record<string, CanActivate>;

    constructor(
        private readonly reflector: Reflector,
        private readonly accessTokenGuard: AccessTokenGuard,
        private readonly apiKeyGuard: ApiKeyGuard
    ) {
        this.authTypeGuardMap = {
            [AuthType.Bearer]: this.accessTokenGuard,
            [AuthType.ApiKey]: this.apiKeyGuard,
            [AuthType.None]: { canActivate: () => true },
        };
    }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {   
      // console.log('AuthenticationGuard canActivate called');
    const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AuthType.None], options: { condition: ConditionGuard.And } };
    const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType])
    let error = UnauthorizedException 
    if(authTypeValue.options.condition === ConditionGuard.Or) {
       for(const instance of guards) {
        const canActivate = await Promise.resolve(instance.canActivate(context)).catch(err => {
          error = err
          return false
        })
        if(canActivate) {
          return true; // If any guard allows access, return true
        }
      }
      throw new error
    } else {
      for(const instance of guards) {
        const canActivate = await Promise.resolve(instance.canActivate(context)).catch(err => {
          error = err
          return false
        })
        if(!canActivate) {
          throw new UnauthorizedException();
        }
      }
      return true; // API key is valid
    }

  }
}