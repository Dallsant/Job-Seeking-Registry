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
import { SessionRepository, UserRepository, LocationRepository } from '../repositories';
import { ResponseManager } from '../services/response-manager';
import { inject } from '@loopback/context';
import { userInfo } from 'os';
import { User } from '../models/index';
import { SessionServiceProvider } from '../services';


export class LocationController {
  public responseObject: ResponseManager;

  constructor(
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
    @repository(LocationRepository)
    public locationRepository: LocationRepository,
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @inject('services.SessionServiceProvider')
    public sessionServiceProvider: SessionServiceProvider,
  ) {
    this.responseObject = new ResponseManager(this.response);

  }

  @get('/locations/count')
  async count(): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    this.responseObject.data = await this.locationRepository.count();
    return this.responseObject.successResponse();
  }

  @get('/locations')
  async find(
  ): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {
      this.responseObject.data = await this.locationRepository.find();
      return this.responseObject.successResponse();
    } catch (error) {
      return this.responseObject.defaultErrorResponse();
    }
  }

  @get('/locations/{id}')
  async findById(@param.path.string('id') id: string): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {
      this.responseObject.data = await this.locationRepository.findById(id);
      return this.responseObject.successResponse();
    } catch (error) {
      return this.responseObject.defaultErrorResponse();
    }
  }
}
