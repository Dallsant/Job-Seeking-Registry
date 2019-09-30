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
} from '@loopback/rest';
import {JobApplication} from '../models';
import {JobApplicationRepository} from '../repositories';

export class ApplicationController {
  constructor(
    @repository(JobApplicationRepository)
    public jobApplicationRepository : JobApplicationRepository,
  ) {}

  @post('/job-applications', {
    responses: {
      '200': {
        description: 'JobApplication model instance',
        content: {'application/json': {schema: getModelSchemaRef(JobApplication)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(JobApplication, {
            title: 'NewJobApplication',
            exclude: ['id'],
          }),
        },
      },
    })
    jobApplication: Omit<JobApplication, 'id'>,
  ): Promise<JobApplication> {
    return this.jobApplicationRepository.create(jobApplication);
  }

  @get('/job-applications/count', {
    responses: {
      '200': {
        description: 'JobApplication model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(JobApplication)) where?: Where<JobApplication>,
  ): Promise<Count> {
    return this.jobApplicationRepository.count(where);
  }

  @get('/job-applications', {
    responses: {
      '200': {
        description: 'Array of JobApplication model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(JobApplication)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(JobApplication)) filter?: Filter<JobApplication>,
  ): Promise<JobApplication[]> {
    return this.jobApplicationRepository.find(filter);
  }

  @patch('/job-applications', {
    responses: {
      '200': {
        description: 'JobApplication PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(JobApplication, {partial: true}),
        },
      },
    })
    jobApplication: JobApplication,
    @param.query.object('where', getWhereSchemaFor(JobApplication)) where?: Where<JobApplication>,
  ): Promise<Count> {
    return this.jobApplicationRepository.updateAll(jobApplication, where);
  }

  @get('/job-applications/{id}', {
    responses: {
      '200': {
        description: 'JobApplication model instance',
        content: {'application/json': {schema: getModelSchemaRef(JobApplication)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<JobApplication> {
    return this.jobApplicationRepository.findById(id);
  }

  @patch('/job-applications/{id}', {
    responses: {
      '204': {
        description: 'JobApplication PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(JobApplication, {partial: true}),
        },
      },
    })
    jobApplication: JobApplication,
  ): Promise<void> {
    await this.jobApplicationRepository.updateById(id, jobApplication);
  }

  @put('/job-applications/{id}', {
    responses: {
      '204': {
        description: 'JobApplication PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() jobApplication: JobApplication,
  ): Promise<void> {
    await this.jobApplicationRepository.replaceById(id, jobApplication);
  }

  @del('/job-applications/{id}', {
    responses: {
      '204': {
        description: 'JobApplication DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.jobApplicationRepository.deleteById(id);
  }
}
