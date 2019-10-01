
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import { inject, Provider } from '@loopback/core';
import { SessionServiceProvider } from './session.service';
import { } from '../repositories';



export class AuthenticationServiceProvider implements Provider<any> {

  constructor(
  ) {

  }

  value(): any {
    return 'Autenticación';
  }



}

