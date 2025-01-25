import { Component, OnInit } from '@angular/core';
import { RecentTasksComponent } from '../recent-tasks/recent-tasks.component';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FilterComponent } from '../filter/filter.component';
import { ShareFilters } from '../../services/filters_services/share_filters.service';
import { ShareFiltersTasks } from '../../services/filters_services/share_filters_tasks.service';


@Component({
  selector: 'app-tasks',
  imports: [CommonModule, ReactiveFormsModule, RecentTasksComponent, FilterComponent],
  templateUrl: './tasks.component.html',
  animations: [trigger('fadeInOut', [state('void', style({ opacity: 0, height: '0px', overflow: 'hidden', padding: '0px' })), state('*', style({ opacity: 1, height: '*', overflow: 'hidden', padding: '*' })), transition('void => *', [animate('300ms ease-in')]), transition('* => void', [animate('300ms ease-out')])])],
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  filter: any;

  noStatus = 'Ningún estado seleccionado';
  noCategory= 'Ninguna categoría seleccionada';


  constructor(private fb: FormBuilder, private SharedFiltersTasks: ShareFiltersTasks) { }
  ngOnInit() {

    this.SharedFiltersTasks.currentFilterDataTasks.subscribe(data => {
      if (data) {
        this.filter = data;

        if(this.filter?.categoria=='Seleccionar categoría:'){
          this.filter.categoria=this.noCategory;
        }

        if(this.filter?.estado=='Seleccionar estado:'){
          this.filter.estado=this.noStatus;
        }
      }
      // console.log('Filtros de ShareFiltersTasks recibidos en TaskComponent:', this.filter);
    });

  }




}

