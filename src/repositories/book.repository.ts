import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Author, Book, BookRelations, Category} from '../models';
import {AuthorRepository} from './author.repository';
import {CategoryRepository} from './category.repository';

export class BookRepository extends DefaultCrudRepository<
  Book,
  typeof Book.prototype.id,
  BookRelations
> {
  public readonly author: BelongsToAccessor<Author, typeof Book.prototype.id>;
  public readonly category: BelongsToAccessor<Category, typeof Book.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('AuthorRepository') protected authorRepositoryGetter: Getter<AuthorRepository>,
    @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Book, dataSource);
    this.author = this.createBelongsToAccessorFor('author', authorRepositoryGetter);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter);

    this.registerInclusionResolver('author', this.author.inclusionResolver);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
