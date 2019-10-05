import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MySequence } from './sequence';
import { ResponseManager } from './services/response-manager';
import { SessionServiceProvider, DataServiceProvider } from './services';
import { setInterval } from 'timers';
// import { SessionServiceProvider } from './services/index';
global.session_timeout = 86400000;
let sessionService: any = null;


export class JobseekerBackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bind('services.ResponseManager').toClass(
      ResponseManager
    );
    this.bind('services.SessionServiceProvider').toClass(
      SessionServiceProvider
    );
    this.bind('services.DataServiceProvider').toClass(
      DataServiceProvider
    );
    this.projectRoot = __dirname;
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
  async boot() {
    await super.boot();
    try {
      sessionService = await this.get('services.SessionServiceProvider');
    } catch (error) {
      throw 'An error has occurred while starting the Session Service';
    }
     this.end_expired_session()
  }

   end_expired_session() {
    setInterval( () => {
      try {
        sessionService.terminateExpiredSessions();
      } catch (error) {
        throw 'An error has occured while closing expired sessions';
      }
    }, 4000);
    // 86400000 for once a day
  };
}
