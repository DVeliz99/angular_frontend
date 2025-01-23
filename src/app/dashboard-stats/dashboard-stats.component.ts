import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserBasicInfoComponent } from './user-basic-info/user-basic-info.component';
import { RecentTasksComponent } from '../recent-tasks/recent-tasks.component';
import { DynamicChartComponent } from './dynamic-chart/dynamic-chart.component';
import { FilterComponent } from '../filter/filter.component';
import { StateService } from '../state.service';
import { ShareFilters } from '../../services/filters_services/share_filters.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { FilteredDataSharing } from '../../services/user_filtered_info/filter_data-sharing.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

//En ngOnInit() empieza a ejecutar lo del componente automaticamente

@Component({
  selector: 'app-dashboard-stats',
  imports: [RecentTasksComponent, UserBasicInfoComponent, DynamicChartComponent, FilterComponent, CommonModule],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.css'
})
export class DashboardStatsComponent implements OnInit, OnDestroy {
  showCategoryFilter = true;
  filter!: any;
  filteredData!: any;
  private dashboardApi_1 = `${environment.apiUrl}dashboard/dashboard1.php`; // URL de la API
  stateSubscription!: Subscription;
  getFiltersSubscription!: Subscription;
  getFilteredDataSubscription!: Subscription;


  constructor(private stateService: StateService,
    private FilterParameter: ShareFilters, private http: HttpClient
    , private getFilteredData: FilteredDataSharing) { }

  ngOnInit() {
    this.stateSubscription = this.stateService.estadoFilterEnabled$.subscribe(state => {
      this.showCategoryFilter = state;
    });

    this.getFiltersSubscription = this.FilterParameter.currentFilterData.subscribe(filterData => {
      if (filterData) {
        // console.log('Filtros recibidos en Dashboard-Starts:', filterData);
        this.ejecutarFiltro(filterData); // Ejecutar el filtro automáticamente cuando se reciban los datos
        // console.log('El metodo ejecutarFiltro se ha ejecutado en Dashboard-Starts');

      }
    });


  }

  // Función que realiza la solicitud HTTP con los filtros actuales
  ejecutarFiltro(filterData: any): void {
    const { startDate, endDate, categoria } = filterData;
    const userId = this.obtenerUserId();

    let params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate)
      .set('category', categoria)
      .set('user_id', userId);


    // console.log('Parametros para la solicitud HTTP en Dashboard-stats:', params.toString());

    this.getFilteredDataSubscription = this.http.get<any>(this.dashboardApi_1, { params }).subscribe(
      response => {
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          this.filteredData = response.data[0];
          // console.log('Respuesta recibida en dashboard-stats', this.filteredData);
          this.getFilteredData.updateResponseData(this.filteredData); // Actualizar FilteredDataSharing con la respuesta console.log('Respuesta HTTP enviada a FilteredDataSharing:', this.filteredData); } else { console.log('No se recibieron datos válidos en dashboard-stats'); this.getFilteredData.updateResponseData(null); } }, error => { console.error('No se pudo enviar la respuesta HTTP a FilteredDataSharing:', error);
          this.getFilteredData.updateResponseData(null);
        }
      }
    );
  }


  // Método para obtener el user_id desde el localStorage
  private obtenerUserId(): string {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.user_id; // Retorna el user_id
    }
    return ''; // Devuelve una cadena vacía si no se encuentra el user_id
  }


  ngOnDestroy(): void {

    if (this.getFilteredDataSubscription) {
      this.getFilteredDataSubscription.unsubscribe();
    }
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();

    }
    if (this.getFiltersSubscription) {
      this.getFiltersSubscription.unsubscribe();
    }

    // console.log('subscripciones y filteredData destruidos');


  }






}
