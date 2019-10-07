import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Location extends Entity {
  @property({
    type: 'string',
    required: false,
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: false
  })
  iso: string;

  @property({
    type: 'string',
    required: true
  })
  country: string;

  @property({
    type: 'string',
    required: true
  })
  capital: string;

  @property({
    type: 'string',
    required: false
  })
  currency_code: string;
  
  @property({
    type: 'string',
    required: false
  })
  currency_name: string;

  @property({
    type: 'string',
    required: false
  })
  currency_symbol: string;

  @property({
    type: 'string',
    required: true
  })
  phone: string;

  @property({
    type: 'string',
    required: true
  })
  postal_code_format: string;

  @property({
    type: 'string',
    required: true
  })
  postal_code_regex: string;

  @property({
    type: 'string',
    required: true
  })
  languages: string[];

  @property({
    type: 'number',
    required: false
  })
  country_id: number;

  @property({
    type: 'any',
    required: true
  })
  cities: any;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Location>) {
    super(data);
  }
}

export interface LocationRelations {
  // describe navigational properties here
}

export type LocationWithRelations = Location & LocationRelations;
