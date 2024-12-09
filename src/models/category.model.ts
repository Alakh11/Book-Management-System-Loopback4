import {Entity, model, property} from '@loopback/repository';

@model()
export class Category extends Entity {
  @property({
    type: 'number',
    id: true, // This marks it as the primary key
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;  // category name, similar to genre

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // define navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
