import { AfterViewInit, Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { FilterService } from '../../services/filters_services/getFilters.service';
import { Task } from '../task.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaksDetail } from '../../services/tasks_service/task_details.service';
import { WarningDialogData } from '../../dialog/dialog_interface';
import { WarningDialogService } from '../../dialog/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmErrorModalComponent } from '../confirm-error-modal/confirm-error-modal.component';
import { HttpHeaders } from '@angular/common/http';
import { MessageModalService } from '../../services/message_modal_services/message_modal.service';
import { modalMessageInterface } from '../../modal_interface/modalMessage_interface';

declare let bootstrap: any;

@Component({
    selector: 'app-form-task-manager',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form-task-manager.component.html',
    styleUrl: './form-task-manager.component.css'
})
export class FormTaskManagerComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

    /*Propiedades */
    user_id!: any;
    taskForm: FormGroup = new FormGroup({});
    isEditing = false;
    restrictFilter = false;
    tasks: Task[] = []; // Definir el tipo de la lista de tareas
    selectedTaskId: number | null = null;
    taskDetail!: any;
    currentTaskDetail!: any;
    statusFormEnabling = true;
    statusArray: any[] = [];
    filteredStates: any[] = [];
    isVisible = false; // Inicialmente no visible
    isCategoryVisible = false;
    currentTask_id!: any;
    currentTaskStatus!: string;
    categories: string[] = [];
    task_id: any;
    successMessage!: string;
    errorMessage!: string;
    successMessageCreate!: string;
    errorMessageCreate!: string;
    readonlyMode = false;
    // Orden deseado
    desiredOrder = ['Pendiente', 'Completada', 'Expirada'];
    nofilters = true;
    tooltipTriggerList: any[] = [];
    modalMessage!: modalMessageInterface;


    constructor(private fb: FormBuilder, private router: Router,
        private specificTaskDetail: TaksDetail, private filterStatus: FilterService, private filterCategory: FilterService
        , private warningDialogService: WarningDialogService, private http: HttpClient, private dialog: MatDialog
        , private messageModalService: MessageModalService
    ) {

        //configuracion de los campos y validaciones
        this.taskForm = this.fb.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            status: ['', Validators.required], //Valor predeterminado cuando se cree una tarea 
            startDate: ['', Validators.required],
            endDate: ['', Validators.required]
        });

    }

    ngOnInit() {
        // console.log('Isvisible', this.isVisible);
        this.updateReadonlyMode();
        this.getCategories();
        this.statusChange(this.statusArray);
        // console.log('isEditing', this.isEditing);
        // console.log('restrictFilter', this.restrictFilter);

        //se cargan los datos de la tarea
        this.specificTaskDetail.currentTaskDetails.subscribe(data => {
            this.currentTaskDetail = data;
            // console.log('informacion del servicio de TaskDetail recibida en form-stask-manager', this.currentTaskDetail);
            if (this.currentTaskDetail) {
                this.taskForm.patchValue({
                    name: this.currentTaskDetail.data[0].task_name,
                    category: this.currentTaskDetail.data[0].category,
                    status: this.currentTaskDetail.data[0].status,
                    startDate: this.currentTaskDetail.data[0].fecha_inicio_tarea,
                    endDate: this.currentTaskDetail.data[0].due_date
                });
                //Estado de la tarea actual y otras variables de modo 
                this.task_id = this.currentTaskDetail.data[0].id_task;
                this.currentTaskStatus = this.taskForm.status;
                this.readonlyMode = true;
                this.updateReadonlyMode(); // Añadir esta línea
                //Habilitamos los botones de edicion
                this.isEditing = true;
                // console.log('isEditing', this.isEditing);

            }
        })


        this.filterStatus.obtenerEstados().subscribe(response => {
            if (response.status === 'success' && Array.isArray(response.data)) {
                // console.log('Estados', response);

                // Añadir los estados del filtro estado en el formulario dentro de la respuesta al arreglo statusArray
                response.data.forEach((item: { status: string } | undefined) => { //Para evitar acceder a una propiedad de un objetov undefined 
                    if (item && item.status && item.status !== 'Expirada') {
                        if (!this.isEditing && !this.restrictFilter) {
                            this.statusArray = ['Pendiente'];
                        } else {
                            this.statusArray.push(item.status);
                        }
                    }
                });

                // console.log('Estados obtenidos en el statusArray:', this.statusArray);
                // Verificar que haya elementos en el arreglo antes de acceder a ellos
                if (this.statusArray.length > 1) {
                    // console.log('Cualquier elemento dentro de statusArray', this.statusArray[1]);
                } else {
                    // console.log('El statusArray tiene menos de 2 elementos.');
                }
            }
        }, error => {
            // console.error('Error obteniendo los estados:', error);
        });

        //No hay filtros disponibles en el modo readonly
        if (!this.isEditing) {
            this.nofilters = false;
        }
    }

    ngAfterViewInit() {
        //Cuando la vista se cargue, iniciar el tooltip
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')) as HTMLElement[];
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            tooltipTriggerEl.addEventListener('mouseenter', () => {
                const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl) || new bootstrap.Tooltip(tooltipTriggerEl);
                tooltipInstance.show();
            });
            tooltipTriggerEl.addEventListener('mouseleave', () => {
                const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
                if (tooltipInstance) {
                    tooltipInstance.dispose();
                }
            });

            //  Se destruye cuando se le da click al elemento
            tooltipTriggerEl.addEventListener('click', () => {
                const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
                if (tooltipInstance) {
                    tooltipInstance.dispose();
                }
            });

        });

    }


    //Modals y mensajes 

    openModal(type: string, title: string, message: string): void {
        this.dialog.open(ConfirmErrorModalComponent, {
            width: '300px', data: { type, title, message }
        });
    }


    showSuccess(message: string) {
        this.openModal('success', 'Éxito', message);
    }

    // showError(message: string) {
    //     this.openModal('error', 'Error', message);
    // }

    showErrorDate() {
        this.openModal('info', 'Aviso', 'Por favor, asegúrate de ingresar las fechas en el formato correcto (DD-MM-AAAA) para evitar errores');
    }


    //Para detectar cada vez que readonlyMode cambie

    ngOnChanges() {
        this.updateReadonlyMode();
        this.statusChange(this.statusArray);
        this.noFilters();
    }

    ngOnDestroy(): void {
        this.specificTaskDetail.resetTaskDetail();

        // Destruir tooltips cuando el componente sea destruido
        this.tooltipTriggerList.forEach((tooltip) => {
            tooltip.dispose();
        });
    }


    //Métodos que llaman al servicio de dialogo y confirman la acción 
    openEditWarning(): void {
        const data: WarningDialogData = {
            title: 'Editar Tarea',
            message: '¿Estás seguro de que quieres editar la tarea?',
            type: 'warning'
        };

        const formData = { ...this.taskForm.value, task_id: this.task_id }; // Obtén los datos del formulario y el task_id para la solitud http 
        // console.log('Valores de formData', formData);

        this.warningDialogService.openWarningDialog(data).subscribe(result => {
            if (result.confirmed) {
                this.onEditTask(formData);
            }
        })
    }

    openDeleteWarning(): void {
        const data: WarningDialogData = {
            title: 'Eliminar Tarea',
            message: '¿Estás seguro de que quieres eliminar la tarea?',
            type: 'error'
        };

        this.currentTask_id = this.currentTaskDetail.data[0].id_task;

        if (!this.currentTask_id) {
            // console.error('Task ID no encontrado.');
            return;
        } else {
            // console.log('Task_id a eliminar', this.currentTask_id);

        }
        this.warningDialogService.openWarningDialog(data).subscribe(result => {
            // console.log('Response', result);
            if (result.confirmed) {
                this.onDeleteTask(this.currentTask_id);
                this.isEditing = false;
                this.taskForm.reset();

            }



        });
    }




    //Habilitación y ejecución de acciones 

    //Método para actualizar la tarea
    onEditTask(formData: any): void {
        // console.log('Valores de formData a Editar', formData);

        if (this.isEditing && this.restrictFilter) {
            if (!this.properFilterDate(formData.startDate, formData.endDate)) {
                this.http.put<any>(`${environment.apiUrl}tasks/edit_task/`, formData).subscribe(response => {
                    // console.log('Respuesta desde edit_task.php:', response);
                    if (response.status === 'success') {
                        this.successMessage = response.message;
                        this.modalMessage = {
                            type: response.status,
                            title: 'Éxito',
                            message: this.successMessage
                        };
                        this.messageModalService.changeMessage(this.modalMessage);

                    } else {
                        this.errorMessage = response.message;
                        // this.showError(this.errorMessage);
                        this.modalMessage = {
                            type: response.status,
                            title: 'Error',
                            message: this.errorMessage
                        };
                        this.messageModalService.changeMessage(this.modalMessage);

                    }
                });
            }
        }
    }


    //Habilita el modo edición 
    onEdit() {

        this.restrictFilter = true;
        this.nofilters = false;

        //Evitar que la tareas expiradas se puedan editar 
        if (this.currentTaskDetail.data[0].status !== 'Expirada') {
            this.readonlyMode = false;
        }

        // console.log('restrictFilter', this.restrictFilter);
        this.statusChange(this.statusArray);
    }

    onCancel() {
        this.isEditing = false;
        this.readonlyMode = false;
        this.restrictFilter = false;
        this.taskForm.reset();
        this.isVisible = false;
        this.isCategoryVisible = false;


        // Restaurar el statusArray al estado original
        this.filterStatus.obtenerEstados().subscribe(response => {
            if (response.status === 'success' && Array.isArray(response.data)) {
                this.statusArray = response.data.map((item: any) => item.status); // Ordenar el statusArray nuevamente
                this.statusArray.sort((a, b) => this.desiredOrder.indexOf(a) - this.desiredOrder.indexOf(b)); // Actualizar el statusArray después de restaurarlo 
                // console.log("nuevo arreglo despues de dar click en cancelar", this.statusArray);
                this.statusChange(this.statusArray);

            }
        },
            error => {
                return error;
            });

    }

    onDeleteTask(currentTask_id: any) {

        // console.log('El task_id a eliminar', currentTask_id);

        //Encabezados y cuerpo de la solicitud 
        const options = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: { task_id: currentTask_id }
        };

        // console.log('El cuerpo en la solicitud http', options.body);

        this.http.delete<any>(`${environment.apiUrl}tasks/delete_task/`, options).subscribe({
            next: (response) => {
                if (response && response.status === 'success') {
                    this.successMessage = response.message;
                    this.modalMessage = {
                        type: 'success',
                        title: "Éxito",
                        message: this.successMessage
                    };
                    this.messageModalService.changeMessage(this.modalMessage);
                } else if (response && response.status === 'error') {
                    this.errorMessage = response.message;
                    // this.showError(this.errorMessage);
                    this.modalMessage = {
                        type: 'error',
                        title: "Error",
                        message: this.errorMessage
                    };
                    this.messageModalService.changeMessage(this.modalMessage);
                }
            },
            error: (err) => {
                // console.log('Error de comunicación con el servidor:', err);

                this.modalMessage = {
                    type: 'error',
                    title: "Error",
                    message: 'Error de comunicación con el servidor'
                };
                this.messageModalService.changeMessage(this.modalMessage);

            }
        });
    }

    //Agregar tarea
    onCreateTask() {
        if (!this.properFilterDate(this.taskForm.value.startDate, this.taskForm.value.endDate)) {
            const storedUser = localStorage.getItem('user');

            if (storedUser) {
                const user = JSON.parse(storedUser);
                this.user_id = user.user_id; // Obtenemos el user_id
                // console.log('User_id', this.user_id);

            }

            // Crear objeto FormData
            const formData = new FormData(); //Para que se envien los datos 

            formData.append('user_id', this.user_id);
            formData.append('name', this.taskForm.value.name);
            formData.append('category', this.taskForm.value.category);
            formData.append('status', this.taskForm.value.status);
            formData.append('startDate', this.taskForm.value.startDate);
            formData.append('endDate', this.taskForm.value.endDate);

            this.http.post<any>(`${environment.apiUrl}tasks/create_task/`, formData).subscribe({
                next: (response) => {
                    // console.log('Esta es la respuesta en form-task-manager',response);
                    
                    if (response && response.status === 'success') {
                        // console.log('Response', response);
                        this.successMessageCreate = response.message;
                        // this.showSuccess(this.successMessageCreate);
                        this.modalMessage = {
                            type: 'success',
                            title: "Éxito",
                            message: this.successMessageCreate
                        };
                        this.messageModalService.changeMessage(this.modalMessage);
                        // console.log('newMessage enviado al MessageModalService en caso de exito desde form-stask-manager', this.modalMessage);
                    } else if (response && response.status === 'error') {
                        // console.log('Response', response);
                        this.errorMessageCreate = response.message;
                        // this.showError(this.errorMessageCreate);
                        // Crear el objeto con los valores
                        this.modalMessage = {
                            type: 'error',
                            title: "Error",
                            message: this.errorMessageCreate
                        };
                        this.messageModalService.changeMessage(this.modalMessage);
                        // console.log('newMessage enviado al MessageModalService desde form-stask-manager');



                    }

                }, error: (err: any) => {
                    // console.log('Error de comunicación con el servidor:', err);
                    this.modalMessage = {
                        type: "error",
                        title: "Error en la operación",
                        message: 'Error de comunicación con el servidor'
                    };
                    this.messageModalService.changeMessage(this.modalMessage);
                }
            })
        }
    }

    //Cambios de estado 
    updateReadonlyMode() {
        this.readonlyMode;
    }

    //Obtener categorías
    getCategories() {
        this.filterCategory.obtenerCategorias().subscribe(response => {
            // console.log('response de las categorias del filtro', response);

            response.data.forEach((categoria: { category: string }) => {
                this.categories.push(categoria.category);
            });
            // console.log('Categorias añadidas al arreglo categorias', this.categories);

        })

    }

    //Añadir categoría como valor actual en el formulario

    selectCategory(category: string): void {
        this.taskForm.patchValue({
            category: category
        });

    }

    //Asegurarse que las fechas sean seleccionadas adecuadamente

    properFilterDate(startDate: Date, endDate: Date): boolean {
        if (startDate > endDate) {
            //Mostar pop-up alert 
            this.showErrorDate();
            return true;
        }
        return false;

    }


    //Deshabilitar filtros cuando se esta en el readonlymode    
    noFilters() {
        this.nofilters;
        this.isCategoryVisible = false;
        this.isVisible = false;
    }


    //Cambiar las opciones del filtro estado según el modo 

    statusChange(statusArray: string[]): void {
        let index;

        if (this.isEditing && !this.restrictFilter) {
            this.nofilters = true;
            statusArray = [];
        } else
            //Cuando se le de click al boton Editar   
            if (this.isEditing && this.restrictFilter) {
                index = statusArray.indexOf("Expirada");
                // Encuentra el índice del valor "Expirada" 

                // Si se encuentra el índice, remueve el elemento en esa posición
                if (index !== -1) {
                    statusArray.splice(index, 1);
                }
                // console.log('nuevo arreglo despues de remover el valor "Expirada" ', statusArray);
            }
            //Cuando este creando una tarea
            else if (!this.isEditing && !this.restrictFilter) {
                index = statusArray.indexOf("Expirada");
                if (index !== -1) {
                    statusArray.splice(index, 1);
                }

                index = statusArray.indexOf("Completada");

                if (index !== -1) {
                    statusArray.splice(index, 1);
                }
                // console.log('nuevo arreglo despues de remover el valor "Expirada" ', statusArray);
            }
    }

    //Mostrar opciones ocultas

    toggleVisibility(): void {
        this.isVisible = !this.isVisible;
        this.isCategoryVisible = false;

    }

    toggleVisibilityCategory(): void {
        this.isCategoryVisible = !this.isCategoryVisible;
        this.isVisible = false;
    }


    //Captura el estado clickeado

    selectState(selectedState: string) {
        // El valor del elemento li clickeado entra como para parametro
        // console.log('Estado seleccionado:', selectedState);
        // console.log('Isvisible', this.isVisible);
        this.taskForm.patchValue({
            status: selectedState

        });

    }

}
