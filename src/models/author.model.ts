import {Entity, model, property} from '@loopback/repository';

@model()
export class Author extends Entity {
  @property({
    type: 'number',
    id: true,  // This makes it the ID field
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: false,
  })
  name: string;

  @property({
    type: 'string',
  })
  createdAt: string;

  @property({
    type: 'string',
  })
  updatedAt: string;


  constructor(data?: Partial<Author>) {
    super(data);
  }
}

export interface AuthorRelations {
  // describe navigational properties here
}

export type AuthorWithRelations = Author & AuthorRelations;
