
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import { inject, Provider } from '@loopback/core';
import { SessionServiceProvider } from './session.service';

export class AuthenticationServiceProvider implements Provider<any> {

  constructor(
    @inject('services.SessionServiceProvider') public sessionServiceProvider: SessionServiceProvider,
    // @repository(UserRepository)
    // public userRepository: UserRepository,    
      ) {

  }

  value(): any {
    return 'Authentication Service';
  }

}

