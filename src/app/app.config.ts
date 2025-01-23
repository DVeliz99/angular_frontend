import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AuthService } from '../services/restriction_routes_services/auth.service';
import { ProfileDataService } from '../services/user_data_service/profile.service';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WarningDialogService } from '../dialog/dialog.service';
import { ShareFilters } from '../services/filters_services/share_filters.service';
import { ShareFiltersTasks } from '../services/filters_services/share_filters_tasks.service';
import { SharedHttpService } from '../services/tasks_service/tasks.service';
import { FilteredDataSharing } from '../services/user_filtered_info/filter_data-sharing.service';
import { AuthGuard } from '../services/restriction_routes_services/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay())
    ,provideAnimations(),    provideHttpClient(withFetch()), provideAnimationsAsync(), provideAnimationsAsync() , // Habilitar el uso de fetch ,
    AuthService,ProfileDataService, WarningDialogService,ShareFilters,ShareFiltersTasks,SharedHttpService,FilteredDataSharing,AuthService,AuthGuard


  ]
};
