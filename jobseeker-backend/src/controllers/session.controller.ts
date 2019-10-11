import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  Response,
  RestBindings,
  Request
} from '@loopback/rest';
import { Session } from '../models';
import { SessionRepository, UserRepository } from '../repositories';
import { ResponseManager } from '../services/response-manager';
import { inject } from '@loopback/context';
import { userInfo } from 'os';
import { User } from '../models/index';
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
import { SessionServiceProvider } from '../services';

export class SessionController {
  public responseObject: ResponseManager;

  constructor(
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @inject('services.SessionServiceProvider')
    public sessionServiceProvider: SessionServiceProvider,
  ) {
    this.responseObject = new ResponseManager(this.response);

  }

  @post('/login')
  async login(
    @requestBody()
    credentials: any,
  ): Promise<any> {
    const fields = {
      'username': 'required',
      'password': 'required'
    }
    try {
      this.responseObject.validateRequest(credentials, fields);
    } catch (error) {
      return this.responseObject.setResponse();
    }
    try {
      const user = await this.userRepository.findOne({ where: { username: credentials.username } })
      if (user !== null) {
        const password_verification = this.sessionServiceProvider.validatePassword(user.password, credentials.password);
        if (password_verification === true) {
          const session = await this.sessionServiceProvider.createNewSession(user, this.request);
          this.responseObject.data.token = session;
          return this.responseObject.customResponse(false, `Wellcome ${user.name}!`, 200);
        } else {
          return this.responseObject.customResponse(true, "Incorrect password", 422);
        }
      } else {
        return this.responseObject.customResponse(true, "User doesn't exist", 422);
      }
    } catch (error) {
      return this.responseObject.defaultErrorResponse()
    }
  }

  @get('/logout')
  async logout(): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {
      await this.sessionServiceProvider.endSession(this.request.headers['authetication']);
      this.responseObject.customResponse(false, 'See you later!', 200);
      return this.responseObject.successResponse();
    } catch (error) {
      return this.responseObject.defaultErrorResponse();
    }
  }
}

