import { Entity, model, property, hasMany } from '@loopback/repository';
import { JobApplication } from './job-application.model';

@model({ settings: { strict: false } })
export class User extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true
  })
  last_name: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    },
  })
  username: string;

  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
