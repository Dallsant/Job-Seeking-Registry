import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class JobApplication extends Entity {


  @property({
    type: 'string',
    required: false,
    index: {
      unique: true
    }
  })
  id: string;

  @property({
    type: 'string',
    required: false
  })
  description: string;

  @property({
    type: 'string',
    required: true
  })
  company: string;

  @property({
    type: 'string',
    required: true
  })
  position: string;

  @property({
    type: 'number',
    required: true
  })
  location: string;

  @property({
    type: 'string',
    required: true
  })
  applicationDate: string;

  @property({
    type: 'string',
    required: true,
    default: 'none'
  })
  responseDate: string;

  @property({
    type: 'string',
    required: true
  })
  contact: string;

  @property({
    type: 'string',
    default: 'CV SENT'
  })
  status: string;


  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<JobApplication>) {
    super(data);
  }
}

export interface JobApplicationRelations {
  // describe navigational properties here
}

export type JobApplicationWithRelations = JobApplication & JobApplicationRelations;
