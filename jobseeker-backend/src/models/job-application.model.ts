import { Entity, model, property, belongsTo } from '@loopback/repository';
import {User} from './user.model';
@model({ settings: { strict: false } })
export class JobApplication extends Entity {

  @property({
    type: 'string',
    required: false,
    index: {
      unique: true
    },
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true
  })
  user: string;

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
    type: 'string',
    required: true
  })
  location: string;

  @property({
    type: 'number',
    required: true,
    default:0
  })
  application_date: number;

  @property({
    type: 'number',
    required: false,
    default: 0
  })
  response_date: number;

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
