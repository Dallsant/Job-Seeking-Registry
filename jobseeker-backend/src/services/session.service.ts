
import {
  repository,
  Where,
} from '@loopback/repository';
import { inject, Provider } from '@loopback/core';
import { } from '../repositories';
import { timingSafeEqual } from 'crypto';
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
// const bcrypt = require('bcrypt');

export class SessionServiceProvider implements Provider<any> {

  constructor(

  ) { }

  value(): any {
    return 'Login and Logout Service';
  }

}

