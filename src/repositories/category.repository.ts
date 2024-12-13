import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Book, Category} from '../models';
import {BookRepository} from './book.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id
> {
  public readonly books: HasManyRepositoryFactory<Book, typeof Category.prototype.id>;
  constructor(@inject('datasources.mysql') dataSource: MysqlDataSource,
  @repository.getter('BookRepository') protected bookRepositoryGetter: Getter<BookRepository>,
)  {
    super(Category, dataSource);
    this.books = this.createHasManyRepositoryFactoryFor('books', bookRepositoryGetter);

    this.registerInclusionResolver('books', this.books.inclusionResolver);
  }
}
