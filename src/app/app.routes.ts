import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardStatsComponent } from './dashboard-stats/dashboard-stats.component';
import { TasksComponent } from './tasks/tasks.component';
import { AuthGuard } from '../services/restriction_routes_services/auth.guard';
import { NoAuthGuard } from '../services/restriction_routes_services/noAuthGuard.service';


import { AutenticacionComponent } from './autenticacion/autenticacion.component';
import { FormTaskManagerComponent } from './form-task-manager/form-task-manager.component';




export const routes: Routes = [
  // Ruta accesible para usuarios autenticados
  { path: '', component: WelcomeComponent, canActivate: [AuthGuard] },  // La ruta raíz debería tener AuthGuard si es una ruta protegida
  { path: 'profile', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardStatsComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'to-do', component: FormTaskManagerComponent, canActivate: [AuthGuard] },

  // Ruta de autenticación sin guardia para redirigir si no hay sesión activa
  { path: 'authentication', component: AutenticacionComponent, canActivate: [NoAuthGuard] },

  // Rutas comodín en caso de que la ruta no exista
  { path: '**', redirectTo: '', pathMatch: 'full' },  // Ruta de fallback
];

export class AppRoutingModule { }
