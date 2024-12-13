import {Entity, hasMany, model, property} from '@loopback/repository';
import {Book} from './book.model';

@model()
export class Category extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;  // category name, similar to genre

  @hasMany(() => Book)
  books: Book[];

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
}

export type CategoryWithRelations = Category & CategoryRelations;
