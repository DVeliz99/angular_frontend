import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareFilters } from '../../../services/filters_services/share_filters.service';
import { FilteredDataSharing } from '../../../services/user_filtered_info/filter_data-sharing.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user-basic-info',
  imports: [CommonModule],
  templateUrl: './user-basic-info.component.html',
  styleUrl: './user-basic-info.component.css'
})
export class UserBasicInfoComponent implements OnInit, OnDestroy {

 /*Propiedades */
  startDate: string = '';
  endDate: string = '';
  category: string = '';
  filters: any;
  SharedFilterData: any;
  shareFilteredDataSubscription!: Subscription;
  getFiltersSubscription!:Subscription;
  noCategory: string = 'Ninguna categoría seleccionada';

  constructor(private filteredData: FilteredDataSharing, private filter: ShareFilters) { }

  ngOnInit() {

    //Subscripcion al servicio que contiene la respuesta HTTP con los filtros aplicados
    this.shareFilteredDataSubscription = this.filteredData.currentResponseData.subscribe(response => {
      if (response) {
        // console.log('Respuesta recibida en user-basic-info:', response);
        this.SharedFilterData = response; // Guardar la respuesta en una variable local
      }
    });

   this.getFiltersSubscription= this.filter.currentFilterData.subscribe(data => {
      this.filters = data;
      if (this.filters?.categoria == 'Seleccionar categoría:') {
        this.filters.categoria = this.noCategory;

      }
      // console.log('Filtros recibidos en user-basic-info:', this.filters);

    })

  }

  ngOnDestroy(): void {
    if (this.shareFilteredDataSubscription) {
      this.shareFilteredDataSubscription.unsubscribe();
    }

    if(this.getFiltersSubscription){
      this.getFiltersSubscription.unsubscribe();
    }

    this.filteredData.resetResponseData();
    this.filter.resetFilterData();

    // console.log('filteredData y filter destruidos');
    
  }

}
