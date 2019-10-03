import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Session extends Entity {
  // Define well-known properties here

  @property({
    type: 'string',
    id: true,
    generated: true,

  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  user: string;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'string',
    required: true,
  })
  ip: string;

  @property({
    type: 'number',
    required: true,
    default: () => Math.round((new Date().getTime() / 100 ) )
  })
  login_date: number;

  @property({
    type: 'number',
    required: true,
    default: 0
  })
  logout_date: number;

  @property({
    type: 'boolean',
    required: true,
    default: true
  })
  is_active: boolean;
  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any


  [prop: string]: any;

  constructor(data?: Partial<Session>) {
    super(data);
  }
}

export interface SessionRelations {
  // describe navigational properties here
}

export type SessionWithRelations = Session & SessionRelations;
