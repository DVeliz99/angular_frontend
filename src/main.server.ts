import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { enableProdMode } from '@angular/core';
import { environment } from './environment/environment';


if (environment.production) {
    enableProdMode(); //habilita el modo de production
  }

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;

export class AppServerModule {}