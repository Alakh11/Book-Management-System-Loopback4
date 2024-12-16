import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Author, Book} from '../models';
import {AuthorRepository, BookRepository, CategoryRepository} from '../repositories';

export class BookController {
  constructor(
    @repository(BookRepository)
    public bookRepository: BookRepository,
    @repository(AuthorRepository)
    public authorRepository: AuthorRepository,
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {}

  // Example function that uses `id`
  async getBookById(bookId: string): Promise<Book> {
    return this.bookRepository.findById(bookId);
  }

  @post('/books')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book),
      },
      },
  })

  async addBook(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['title', 'author', 'genre', 'publishedYear', 'isbn'],
            properties: {
              title: {type: 'string'},
              author: {type: 'string'},
              genre: {type: 'string'},
              publishedYear: {type: 'number'},
              isbn: {type: 'number'},
            },
          },
        },
      },
    })
      bookData: {
        title: string;
        author: string;
        genre: string;
        publishedYear: number;
        isbn: number;
        },
    ): Promise<Book> {
      try {
        if (!bookData.author) {
          throw new HttpErrors.BadRequest('Author name is required.');
        }
        if (!bookData.genre) {
          throw new HttpErrors.BadRequest('Genre is required.');
        }
      console.log(`Searching for Authors: ${bookData.author}`);
      // Fetch the author record by name
      let author = await this.authorRepository.findOne({
       where: {name: bookData.author},
  });

  if (!author) {
    console.log(`Author '${bookData.author}' not found, creating a new one.`);
    author = await this.authorRepository.create({name: bookData.author});

  }

  // Log category creation attempt
  console.log(`Searching for category(genre): ${bookData.genre}`);

  // Fetch the category(genre) record by name (or create it if it doesn't exist)
  let category = await this.categoryRepository.findOne({
    where: {name: bookData.genre},
  });

  if (!category) {
    console.log(`Category (genre) '${bookData.genre}' not found, creating new category.`);
    category = await this.categoryRepository.create({
    name: bookData.genre,
    });
  } else {
    console.log(`Category (genre) '${category.name}' already exists.`);
  }


  // Create the book using authorId
  const book = await this.bookRepository.create({
    title: bookData.title,
    genre: bookData.genre,
    publishedYear: bookData.publishedYear,
    isbn: bookData.isbn,
    authorId: author.id, // Use the author's ID
    categoryId: category.id,
  });
  console.log('Book added successfully:', book);
  return book;
}
catch (error) {
  console.error('Error while adding book:', error);
  throw new HttpErrors.UnprocessableEntity('Error adding book: ' + error.message);
  }

}
  @get('/books/count')
  @response(200, {
    description: 'Book model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Book) where?: Where<Book>): Promise<Count> {

  try {
    console.log('Where query received:', where);
    const result = await this.bookRepository.count(where);
    console.log('Count result:', result); // Log the result
    return result;
  } catch (error) {
    console.error('Error occurred while counting books:', error);
    throw new HttpErrors.InternalServerError('Invalid query parameter');
  }
  }

  @get('/books')
  @response(200, {
    description: 'Array of Book model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Book) filter?: Filter<Book>): Promise<Book[]> {
    try {
      console.log('Fetching books with filter:', filter);
      const books = await this.bookRepository.find({
        ...filter,
        include: [{
           relation: 'author' ,
           scope: {
            fields: ['name'],
          },
          }]
      });
      console.log('Books found:', books);
      return books;
    } catch (error) {
      console.error('Error while fetching books:', error);
      throw new HttpErrors.InternalServerError('Error fetching books'+ error.message);
    }
  }

  @patch('/books')
  @response(200, {
    description: 'Book PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    book: Book,
    @param.where(Book) where?: Where<Book>,
  ): Promise<Count> {
    return this.bookRepository.updateAll(book, where);
  }

  @get('/books/{id}')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book, {includeRelations: true}),
      },
    },
  })
  async findBookById(
    @param.path.string('id') id: string,
  ): Promise<Book> {
    return this.bookRepository.findById(id, {
      include: [{relation: 'author'}, {relation: 'category'}],
    });
  }

  @get('/books/{id}/author', {
    responses: {
      '200': {
        description: 'Author belonging to Book',
        content: {
          'application/json': {
            schema: {type: 'object', items: getModelSchemaRef(Author)},
          },
        },
      },
    },
  })
  async findAuthor(
    @param.path.number('id') bookId: typeof Book.prototype.id,
  ): Promise<Author> {
    return this.bookRepository.author(bookId);
  }

  @patch('/books/{id}')
  @response(204, {
    description: 'Book PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    book: Book,
  ): Promise<void> {
    await this.bookRepository.updateById(id, book);
  }

  @put('/books/{id}')
  @response(204, {
    description: 'Book PUT success',
  })
  async replaceById(
    @param.path.number('id') id: string,
    @requestBody() book: Book,
  ): Promise<void> {
    await this.bookRepository.replaceById(id, book);
  }

  @del('/books/{id}')
  @response(204, {
    description: 'Book DELETE success',
  })
  async deleteById(@param.path.number('id') id: string): Promise<void> {
    await this.bookRepository.deleteById(id);
  }
}
