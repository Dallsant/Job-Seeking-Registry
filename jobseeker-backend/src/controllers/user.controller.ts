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
import { User } from '../models';
import { UserRepository } from '../repositories';
import { ResponseManager } from '../services/response-manager';
import { inject } from '@loopback/context';
import { SessionServiceProvider, DataServiceProvider } from '../services';
const bcrypt = require('bcrypt');

export class UserController {
  public responseObject: ResponseManager;

  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject('services.SessionServiceProvider') public sessionServiceProvider: SessionServiceProvider,
  ) {
    this.responseObject = new ResponseManager(this.response);
  }

  @post('/users')
  async create(
    @requestBody()
    user: any,
  ): Promise<any> {
    const fields = {
      'name': 'string',
      'last_name': 'string',
      'email': 'string',
      'username': 'string',
      'password': 'password',
    }
    try {
      this.responseObject.validateRequest(user, fields);
    } catch (error) {
      return this.responseObject.setResponse();
    }
    const already_exists = (await this.userRepository.findOne({ where: { username: user.username } }) !== null)
    if (already_exists === true) {
      return this.responseObject.customResponse(true, "User already exists", 422);
    }
    try {
      const test = user.password;
      user.password = bcrypt.hashSync(user.password, 10);
      bcrypt.hash(test, 10, function (err: any, hash: any) {
        if (err) { throw (err); }
        bcrypt.compare(test, user.password, function (err: any, result: any) {
          if (err) { throw (err); }
        });
      });
      await this.userRepository.create(user);
      return this.responseObject.customResponse(false, "User Created", 200);
    } catch (error) {
      return this.responseObject.defaultErrorResponse()
    }
  }

  @get('/users/count')
  async count(
  ): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {
      const count = await this.userRepository.count();
      this.responseObject.data = count;
      return this.responseObject.successResponse();
    } catch (error) {
      return this.responseObject.setResponse();
    }
  }

  @get('/users')
  async find(
  ): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {
      const applications = await this.userRepository.find({
        fields: {
          'name': true,
          'last_name': true,
          'username': true,
        }
      });
      this.responseObject.data = applications;
      return this.responseObject.successResponse()
    } catch (error) {
      return this.responseObject.setResponse();
    }
  }

  @patch('/users/{id}')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody()
    user: any,
  ): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    const fields = {
      'name': 'string',
      'last_name': 'string',
      'email': 'string',
      'id': 'string'
    }
    try {
      this.responseObject.validateRequest(user, fields);
    } catch (error) {
      return this.responseObject.setResponse();
    }
    const oldUserData = this.userRepository.findOne({ where: { id: user.id } })
    const newUserData: any = oldUserData;
    newUserData.name = user.name;
    newUserData.last_name = user.last_name;
    newUserData.email = user.email;
    try {
      await this.userRepository.updateById(id, newUserData);
      return this.responseObject.successResponse();
    } catch (error) {
      return this.responseObject.setResponse();
    }
  }
}
