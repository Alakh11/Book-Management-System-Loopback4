import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Author, AuthorRelations} from '../models';

export class AuthorRepository extends DefaultCrudRepository<
  Author,
  typeof Author.prototype.id,
  AuthorRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: juggler.DataSource,
   // @repository(BookRepository) public bookRepository: BookRepository,
  ) {
    super(Author, dataSource);
  }
}
