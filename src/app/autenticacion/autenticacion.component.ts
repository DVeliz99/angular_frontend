import { Component } from '@angular/core';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';


@Component({
  selector: 'app-autenticacion',
  imports: [RegisterFormComponent,LoginFormComponent],
  templateUrl: './autenticacion.component.html',
  styleUrl: './autenticacion.component.css'
})
export class AutenticacionComponent {

}
