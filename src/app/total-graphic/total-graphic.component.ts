import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, NgZone, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Router, NavigationEnd } from '@angular/router';
import { FilteredDataSharing } from '../../services/user_filtered_info/filter_data-sharing.service';
import { ProfileDataService } from '../../services/user_data_service/profile.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-total-graphic',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './total-graphic.component.html',
  styleUrls: ['./total-graphic.component.css']
})
export class TotalGraphicComponent implements OnInit, OnDestroy, AfterViewInit {
  data: any;
  options: any;
  ProfileData: any;

  @ViewChild('chart') chart: any;

  private routeSubscription: Subscription | undefined;
  private dashboardsubscription: Subscription | undefined;
  private profilesubscription: Subscription | undefined;

  tareasPendientes = 0;
  tareasCompletadas = 0;
  tareasExpiradas = 0;
  hasData = true;

  constructor(private router: Router, private dashboardDataService: FilteredDataSharing,
    private profileDataService: ProfileDataService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.data = {
      labels: ['Tareas Pendientes', 'Tareas Completadas', 'Tareas Expiradas'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#0ffff8', '#085fc7', '#ff474d'],
          hoverBackgroundColor: ['#7a92ff', '#7a92ff', '#7a92ff']
        }
      ]
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false
    };
  }

  ngOnInit(): void {
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentPath = event.url;
        if (currentPath === '/profile') {
          // console.log('Estamos en la vista de perfil');
          this.subscribeToProfileData();
        } else if (currentPath === '/dashboard') {
          // console.log('Estamos en la vista de dashboard');
          this.subscribeToDashboardData();
        }
      }
    });

    const initialPath = this.router.url;
    if (initialPath === '/profile') {
      this.subscribeToProfileData();
    } else if (initialPath === '/dashboard') {
      this.subscribeToDashboardData();
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.dashboardsubscription) {
      this.dashboardsubscription.unsubscribe();
    }
    if (this.profilesubscription) {
      this.profilesubscription.unsubscribe();
    }


    this.dashboardDataService.resetResponseData();
    this.profileDataService.resetProfileUserData();

    // console.log('Gráfico y información obtenida de los servicios destruidos en total-graphic component');
  }


  /*Subscripciones a los servicios */

  subscribeToProfileData() {
    if (this.profilesubscription) {
      this.profilesubscription.unsubscribe();
    }
    this.profilesubscription = this.profileDataService.currentUserProfileData.subscribe(data => {
      if (data) {
        this.ngZone.run(() => {
          // console.log('Datos recibidos en TotalGraphicComponent desde ProfileDataService:', data);
          this.tareasCompletadas = data?.completed_tasks || 0;
          this.tareasPendientes = data?.pending_tasks || 0;
          this.tareasExpiradas = data?.expired_tasks || 0;
          this.updateChartData();
          // console.log('Gráfico renderizado desde /profile');
        });
      }
    });
  }

  subscribeToDashboardData() {
    if (this.dashboardsubscription) {
      this.dashboardsubscription.unsubscribe();
    }
    this.dashboardsubscription = this.dashboardDataService.currentResponseData.subscribe(data => {
      if (data && typeof data === 'object' && data !== null) {
        // console.log(typeof (data));

        this.ngZone.run(() => {
          // console.log('Datos recibidos en TotalGraphicComponent desde FilteredDataSharing:', data);
          this.tareasCompletadas = parseInt(data.tareas_completadas) || 0; this.tareasPendientes = parseInt(data.tareas_pendientes) || 0;
          this.tareasExpiradas = parseInt(data.tareas_expiradas) || 0;
          // console.log('Valores actualizados desde el componente dashboard-stats en /dashboard: tareas completadas: ' + this.tareasCompletadas + ', tareas pendientes: ' + this.tareasPendientes + ', tareas expiradas: ' + this.tareasExpiradas); this.updateChartData();
          // console.log('Gráfico renderizado desde /dashboard');
        });
      } else {
        // console.log('No se recibieron datos válidos en la ruta /dashboard');
        this.hasData = false;
        this.updateChartData();
      }
    });
  }

  //Actualizar datos en el grafico dependiendo el servicio
  updateChartData() {
    const totalTasks = this.tareasPendientes + this.tareasCompletadas + this.tareasExpiradas;
    this.hasData = totalTasks > 0;

    this.data = {
      labels: ['Tareas Pendientes', 'Tareas Completadas', 'Tareas Expiradas'],
      datasets: [{
        data: [this.tareasPendientes, this.tareasCompletadas, this.tareasExpiradas],
        backgroundColor: ['#0ffff8', '#085fc7', '#ff474d'],
        hoverBackgroundColor: ['#7a92ff', '#7a92ff', '#7a92ff']
      }]
    };

    // console.log('Tareas recibidas en el gráfico', this.tareasCompletadas, this.tareasPendientes, this.tareasExpiradas);

    this.cdr.markForCheck();
    setTimeout(() => {
      if (this.chart) {
        // console.log('Destruyendo gráfico');
        this.chart.chart.destroy();
        this.chart.initChart();
        // console.log('Gráfico recreado con nuevos datos');
      }
    }, 0);
  }
}
