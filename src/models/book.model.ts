import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Author} from './author.model';


@model({name: 'Book'})
export class Book extends Entity {
  @property({
    type: 'string',
    id: true, // marks the field as the ID of the model
    generated: true,
  })
  id: string;  // Explicitly define the ID property


  @property({
    type: 'string',
    required: true,
  })
  title: string;


  @property({
    type: 'string',
    required: true,
  })
  genre: string;

  @property({
    type: 'number',
    required: true,
  })
  publishedYear: number;

  @property({
    type: 'number',
    required: true,
  })
  isbn: number;



  @property({
    type: 'number',
  })
  categoryId?: number;

  @belongsTo(() => Author)
  authorId: number; // Foreign key referencing the Author model
  public author?: Author;

  constructor(data?: Partial<Book>) {
    super(data); // LoopBack will handle the creation of the instance
  }
}

export interface BookRelations {
  // describe navigational properties here
}

export type BookWithRelations = Book & BookRelations;
