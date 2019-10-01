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
import { JobApplication } from '../models';
import { JobApplicationRepository } from '../repositories';
import { ResponseManager } from '../services/response-manager';
import { UserRepository } from '../repositories';
import { inject } from '@loopback/context';

export class ApplicationController {
  public responseObject: ResponseManager;
  constructor(
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @repository(JobApplicationRepository)
    public jobApplicationRepository: JobApplicationRepository,
  ) {
    this.responseObject = new ResponseManager(this.response);
  }

  @post('/job-applications')
  async create(@requestBody() jobApplication: any): Promise<any> {
    console.log(jobApplication);
    let fields = {
      'description': 'string',
      // 'user': 'string',
      'company': 'string',
      'position': 'string',
      'location': 'string',
      'application_date': 'string',
      'contact': 'string',
    }
    try {
      this.responseObject.validateRequest(jobApplication, fields)
    } catch (error) {
      return this.responseObject.setResponse();
    }
    try {
      await this.jobApplicationRepository.create(jobApplication);
      this.responseObject.successResponse();      
    } catch (error) {
      this.responseObject.setResponse();
    }
  }

  @get('/job-applications/count')
  async count(
  ): Promise<any> {
    try {
      let count = await this.jobApplicationRepository.count();
      this.responseObject.data = count;
      return this.responseObject.successResponse();      
    } catch (error) {
      return this.responseObject.setResponse();
    }
  }

  @get('/job-applications')
  async find(
    @param.query.object('filter', getFilterSchemaFor(JobApplication)) filter?: Filter<JobApplication>,
  ): Promise<any> {
    try {
      let applications = await this.jobApplicationRepository.find(filter);
      this.responseObject.data = applications;
      return this.responseObject.successResponse()   
    } catch (error) {
      return this.responseObject.setResponse();
    }
  }
  @get('/job-applications/{id}')
  async findById(@param.path.string('id') id: string): Promise<any> {
    try {
      let application = await this.jobApplicationRepository.findById(id);
      this.responseObject.data = application;
      return this.responseObject.successResponse()   
    } catch (error) {
      return this.responseObject.setResponse();
    }
  }

  @patch('/job-applications/{id}')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody()
    jobApplication: JobApplication,
  ): Promise<any> {
    try {
      let fields = {
        'id': 'string',
        'description': 'string',
        'user': 'number',
        'company': 'string',
        'position': 'string',
        'location': 'number',
        'application_date': 'string',
        'contact': 'string',
        'status': 'string'
      }
      try {
        this.responseObject.validateRequest(JobApplication, fields);
      } catch (error) {
        return this.responseObject.setResponse();
      }
      await this.jobApplicationRepository.updateById(id, jobApplication);
      return this.responseObject.successResponse()   
    } catch (error) {
      return this.responseObject.setResponse();
    } 
  }

  @del('/job-applications/{id}')
  async deleteById(@param.path.string('id') id: string): Promise<any> {
    try {
      await this.jobApplicationRepository.deleteById(id);
      return this.responseObject.successResponse()   
    } catch (error) {
      return this.responseObject.setResponse();
    }   
     }
}
