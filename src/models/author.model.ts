import {Entity, hasMany, model, property} from '@loopback/repository';
import {Book} from './book.model';

@model()
export class Author extends Entity {
  @property({
    type: 'string',
    id: true,  // This makes it the ID field
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => Book)
  books: Book[];

  constructor(data?: Partial<Author>) {
    super(data);
  }
}

export interface AuthorRelations {
  // describe navigational properties here
}

export type AuthorWithRelations = Author & AuthorRelations;
