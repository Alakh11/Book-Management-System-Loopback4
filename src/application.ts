import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {AuthorController, BookController} from './controllers';
import {MysqlDataSource} from './datasources';
import {MySequence} from './sequence';

export {ApplicationConfig};
export class BookmanagementsystemApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Enable CORS (Cross-Origin Resource Sharing)
    this.configure('rest').to({
      cors: {
        origin: 'http://localhost:4200', // Update this to match your frontend's URL
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization',
        preflightContinue: false,
        optionsSuccessStatus: 204,
      },
    });

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);


    // Configure MySQL datasource
    this.dataSource(MysqlDataSource);

    this.projectRoot = __dirname;
    this.controller(BookController);
    this.controller(AuthorController);
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
