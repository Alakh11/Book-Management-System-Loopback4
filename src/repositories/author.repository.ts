import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, juggler, repository } from '@loopback/repository';
import { Author, AuthorRelations, Book } from '../models';
import { BookRepository } from './book.repository';

export class AuthorRepository extends DefaultCrudRepository<
  Author,
  typeof Author.prototype.id,
  AuthorRelations
> {

  public readonly books: HasManyRepositoryFactory<Book, typeof Author.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: juggler.DataSource,
    @repository.getter('BookRepository') protected bookRepositoryGetter: Getter<BookRepository>,
   // @repository(BookRepository) public bookRepository: BookRepository,
  ) {
    super(Author, dataSource);
    this.books = this.createHasManyRepositoryFactoryFor('books', bookRepositoryGetter,);
    this.registerInclusionResolver('books', this.books.inclusionResolver);
  }
}
