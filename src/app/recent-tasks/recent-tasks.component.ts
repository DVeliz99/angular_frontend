import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { SharedHttpService } from '../../services/tasks_service/tasks.service';
import { TaksDetail } from '../../services/tasks_service/task_details.service';
import { catchError, Subscription } from 'rxjs';

@Component({
  selector: 'app-recent-tasks',
  imports: [CommonModule],
  templateUrl: './recent-tasks.component.html',
  styleUrl: './recent-tasks.component.css'
})
export class RecentTasksComponent implements OnInit, OnDestroy {


  tasks: any[] = [];
  taskDetail: any;
  currentTaskDetail: any;
  dashboardSubscription!: Subscription;
  tasksSubscription!: Subscription;



  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router,
    private httpTasksRequestService: SharedHttpService,
    private specificTaskService: TaksDetail
  ) {

  }

  ngOnInit() {


    //Asigna al array tasks los valores dependiendo el behaviorSubject segun la ruta 

    const currentPath = this.router.url;
    if (currentPath === '/dashboard') {
      this.dashboardSubscription = this.httpTasksRequestService.dashboardTasks$.subscribe(response => {
        this.tasks = response || [];
        // console.log('Informacion recibida desde http compartido en el recent-task component para /dashboard:', this.tasks);
      });
    } else if (currentPath === '/tasks') {
      this.tasksSubscription = this.httpTasksRequestService.tasks$.subscribe(response => {
        this.tasks = response || [];
        // console.log('Informacion recibida desde http compartido en el recent-task component para /tasks:', this.tasks);

      });

    }


  }


  //Obtener detalles de la tarea clickeada
  getTaskDetail(taskId: string) {
    // console.log(taskId);

    this.http.get<any>(`${environment.apiUrl}tasks/specificTask`, { params: { taskId } }).subscribe(data => {
      this.taskDetail = data;
      // console.log('Informacion obtenida desde specificTask.php', this.taskDetail);
      // this.isEditing = true;
      // console.log('Nuevo valor de isEditing', this.isEditing);
      this.specificTaskService.changeTaskDetail(this.taskDetail); // Actualizar TaskDetail con la respuesta

      this.router.navigate(['/to-do']); // Navega a la ruta del formulario

    }), (error: any) => {
      // console.error('Error al suscribirse a la tarea:', error);

    }
  }

  ngOnDestroy(): void {
    if (this.dashboardSubscription) {
      this.dashboardSubscription.unsubscribe();
    }

    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }

    this.httpTasksRequestService.resetTasksSubject();
    this.httpTasksRequestService.resetdashboardTasksSubject();

    // console.log('Servicio de http compartido destruido');

  }

  /*Efectos de estilo desde Angular */
  // Usar el parámetro "element" en lugar de pasar un string
  onMouseEnter(element: EventTarget | null) {
    // Cambia el tamaño del elemento cuando el mouse entra
    // Asegurarse de que "element" no sea null y es un HTMLElement
    if (element instanceof HTMLElement) {
      element.style.border = `1px solid ${'#8EC6C5'}`; // Aplica el color de borde
      element.style.backgroundColor = `#F5F5F5 `;
      element.style.color = `#F5F5F5`;
      element.style.transform = 'scale(1.01)';

    }
  }

  onMouseLeave(element: EventTarget | null) {
    // Restaura el tamaño original cuando el mouse sale
    // Asegurarse de que "element" no sea null y es un HTMLElement
    if (element instanceof HTMLElement) {//Verifica si es un elemento HTML

      element.style.border = ''; // Elimina el borde
      element.style.backgroundColor = '';
      element.style.color = `#F5F5F5`;
      element.style.transform = 'scale(1)';
    }

  }
}
