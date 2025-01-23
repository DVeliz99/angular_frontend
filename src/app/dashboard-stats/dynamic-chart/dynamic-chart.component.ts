import { Component, OnInit } from '@angular/core';
import { TotalGraphicComponent } from '../../total-graphic/total-graphic.component';
import { ShareFilters } from '../../../services/filters_services/share_filters.service';

@Component({
  selector: 'app-dynamic-chart',
  imports: [TotalGraphicComponent],
  templateUrl: './dynamic-chart.component.html',
  styleUrl: './dynamic-chart.component.css'
})
export class DynamicChartComponent implements OnInit {

  /*Propiedades */
  filter!: any;

  constructor(private filters: ShareFilters) { }

  //Asingnar el valor obtenido de las variables de estado
  ngOnInit() {

    this.filters.currentFilterData.subscribe(data => {
      this.filter = data;
      // console.log('Filtros recibidos en dynamic-chart:', this.filter);

    })

  }

}
