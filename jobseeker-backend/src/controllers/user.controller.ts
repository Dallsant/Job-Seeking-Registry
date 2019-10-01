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
const bcrypt = require('bcrypt');

export class UserController {
  public responseObject: ResponseManager;

  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response,

  ) {
    this.responseObject = new ResponseManager(this.response);
  }

  @post('/users')
  async create(
    @requestBody()
    user: any,
  ): Promise<any> {
    let fields = {
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
    try {
      user.password = bcrypt.hashSync(user.password, 10);
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
      let count = await this.userRepository.count();
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
      let applications = await this.userRepository.find({
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
    let fields = {
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
    let oldUserData = this.userRepository.findOne({ where: { id: user.id } })
    let newUserData:any = oldUserData;
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
