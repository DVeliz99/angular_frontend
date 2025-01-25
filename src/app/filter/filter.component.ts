import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StateService } from '../state.service';
import { FilterService } from '../../services/filters_services/getFilters.service';
import { ShareFilters } from '../../services/filters_services/share_filters.service';
import { Router } from '@angular/router';
import { ShareFiltersTasks } from '../../services/filters_services/share_filters_tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmErrorModalComponent } from '../confirm-error-modal/confirm-error-modal.component';

declare let bootstrap: any;

@Component({
  selector: 'app-filter',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit, AfterViewInit, OnDestroy {
  /*Propiedades */
  /*Filtros Actualizados */
  categorias: any[] = [];
  estados: any[] = [];
  noStatus!: string;
  noCategory!: string;
  errorMessage!: string;
  tooltipTriggerList: any[] = [];

  @Input() enableEstadoFilter = true; // Asegúrate de que el valor por defecto es true para que aparezca inicialmente
  filterForm!: FormGroup;
  showOptions = false; //Para manejar la visualización del dropdown de opciones
  showOptionsCategory = false;
  dateRangeForm: FormGroup = new FormGroup({}); // Inicializado
  selectedDates: {
    startDate: string, endDate: string
  } = {
      startDate: '', endDate: ''
    };

  selectedStatus = 'Seleccionar estado:';
  selectedCategory = 'Seleccionar categoría:';
  constructor(
    private fb: FormBuilder, private stateService: StateService,
    private filterstate: FilterService, private sharedfilters: ShareFilters,
    private router: Router, private sharedfiltersTasks: ShareFiltersTasks,
    private errorDialog: MatDialog
  ) { }

  ngOnInit() {

    this.cargarCategorias();
    this.cargarEstados();

    this.dateRangeForm = this.fb.group({
      //Valor inicial para mostrar en la vista (por defecto)

      startDate: [this.selectedDates.startDate], endDate: [this.selectedDates.endDate], statusSelect: [this.selectedStatus], category: [this.selectedCategory]
    });

    // Escuchar cambios en el formulario de fechas 
    this.dateRangeForm.valueChanges.subscribe(values => {
      this.selectedDates.startDate = values.startDate;
      this.selectedDates.endDate = values.endDate;
      this.selectedStatus = values.statusSelect;
      this.selectedCategory = values.category;

      // console.log('Datos seleccionado por el usuario', this.selectedDates, this.selectedStatus, this.selectedCategory); // Para verificación
    });

    // Suscribirse al servicio que muestra remueve o muestra el filtro de estado
    this.stateService.estadoFilterEnabled$.subscribe(state => {
      this.enableEstadoFilter = state;
      if (state) {
        if (this.filterForm?.contains('dropdown')) {
          this.filterForm.addControl('dropdown', this.fb.control(''));

        }
      } else {
        if (this.filterForm?.contains('dropdown')) {
          this.filterForm.removeControl('dropdown');
        }
      }
    });

  }

/*Despues que cargue la vista  */
  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

  }




  /*Cargar opciones para el filtrado */

  cargarCategorias(): void {
    this.filterstate.obtenerCategorias().subscribe(data => {
      if (data.status === 'success' && Array.isArray(data.data)) {
        this.categorias = data.data;
        // console.log('Categorias:', this.categorias);
      }
    });

  }

  cargarEstados(): void {
    this.filterstate.obtenerEstados().subscribe(data => {
      if (data.status === 'success' && Array.isArray(data.data)) {
        this.estados = data.data;
        // console.log('Estados:', this.estados);
      }
    });

  }


  /*Otros métodos */


  isStartDateBeforeEndDate(startDate: any, endDate: any): boolean {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      // Si alguna de las fechas no es válida, retornamos false
      return true;
    }
    return (startDate > endDate) || !startDate || !endDate;

  }



  toggleOptions(type: string) {
    if (type === 'status') {
      this.showOptions = !this.showOptions;
    } else if (type === 'category') {
      this.showOptionsCategory = !this.showOptionsCategory;
    }

  }

  //En caso de que solo se le de click a las opciones y no se seleccione ninguna 
  NoneOptionSelected(option: string, type: 'status' | 'category') {
    if (type === 'status') {
      this.selectedStatus = option === 'Seleccionar estado:' ? 'Ningún estado seleccionado' : option;
    } else if (type === 'category') {
      this.selectedCategory = option === 'Seleccionar categoría:' ? 'Ninguna categoría seleccionada' : option;
    }
  }


  selectOption(option: string, type: string) {
    if (type === 'status') {
      // Permite tener los valores juntos para envío al backend
      // En caso de ser 'Seleccionar Estado' se muestra 'Ningún estado seleccionado'
      this.selectedStatus = option;// Actualiza el estado seleccionado
      // console.log('this.selectedStatus', this.selectedStatus);
      this.dateRangeForm.patchValue({ statusSelect: option });  // Actualiza el formulario con el nuevo estado
      this.showOptions = false;  // Oculta las opciones de estado
    } else if (type === 'category') {

      this.selectedCategory = option;  // Actualiza la categoría seleccionada
      // console.log('this.selectedCategory', this.selectedCategory);
      this.dateRangeForm.patchValue({ category: option });  // Actualiza el formulario con la nueva categoría
      this.showOptionsCategory = false;  // Oculta las opciones de categoría
    }

  }

  //Envio de filtros
  aplicarFiltros(): void {

    const filterData: any = {
      startDate: this.selectedDates.startDate,
      endDate: this.selectedDates.endDate,
      categoria: this.selectedCategory === 'Ninguna categoría seleccionada' ? 'Seleccionar categoría:' : this.selectedCategory
    }; // Solo incluir el estado si está habilitado 

    this.showErrorDateFilter();

    if (this.enableEstadoFilter) {
      filterData.estado = this.selectedStatus === 'Ningún estado seleccionado' ? 'Seleccionar estado:' : this.selectedStatus;
    }

    // console.log('Filtros aplicados:', filterData);
    const currentPath = this.router.url;
    if (currentPath === '/dashboard') {
      this.sharedfilters.updateFilterData(filterData);
      // console.log('Filtros enviados al ShareFilterService para el dashboard-stats');
    } else if (currentPath === '/tasks') {
      this.sharedfiltersTasks.updateFilterData(filterData);
      // console.log('Filtros enviados al ShareFilterServiceTasks para el tasks');
    }

  }

  /*Mostrar alertas */

  openModal(type: string, title: string, message: string): void {
    this.errorDialog.open(ConfirmErrorModalComponent, {
      width: '300px',
      data: { type, title, message }
    });

  }


  showErrorDateFilter(): void {
    if (this.isStartDateBeforeEndDate(this.selectedDates.startDate, this.selectedDates.endDate)) {
      this.openModal('info', 'Aviso', 'Por favor, asegúrate de ingresar las fechas en el formato correcto (DD-MM-AAAA) para evitar errores');
    }

  }


  //Resetear filtros
  
  onReset() {
    this.dateRangeForm.patchValue({
      startDate: '',
      endDate: '',
      statusSelect: 'Seleccionar estado:',
      category: 'Seleccionar categoría:'
    });
    
  }

  ngOnDestroy(): void {
      
      // Destruir tooltips cuando el componente sea destruido
      this.tooltipTriggerList.forEach((tooltip) => {
        tooltip.dispose();
    });
  }

}







