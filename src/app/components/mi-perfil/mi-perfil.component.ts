import { Component, OnInit } from '@angular/core';
import { FirestoreUsuariosService } from '../../services/firestore-usuarios.service';
import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';
import { Paciente } from '../../classes/paciente';
import { Especialista } from '../../classes/especialista';
import { Administrador } from '../../classes/administrador';
import { CommonModule } from '@angular/common';
import { MostrarHorariosComponent } from '../mostrar-horarios/mostrar-horarios.component';
import { DisponibilidadPipe } from '../../pipes/disponibilidad.pipe';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, MostrarHorariosComponent, DisponibilidadPipe],
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  usuario: any;
  esPaciente: boolean = false;
  esEspecialista: boolean = false;
  esAdministrador: boolean = false;
  mostrarHorarios: boolean = false;
  horarios: { [key: string]: string[] } = {};

  constructor(
    private auth: AuthService,
    private usuarioService: FirestoreUsuariosService,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.getUsuarioActual();
  }

  async getUsuarioActual() {
    this.loader.show();
    try {
      const correo = this.auth.getCurrentUserEmail();
      if (correo) {
        this.usuario = await this.usuarioService.getUsuarioPorCorreo(correo);
        this.esPaciente = this.usuario instanceof Paciente;
        this.esEspecialista = this.usuario instanceof Especialista;
        this.esAdministrador = this.usuario instanceof Administrador;

        if (this.esEspecialista && this.usuario instanceof Especialista) {
          this.horarios = this.usuario.disponibilidad || {};
        }
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
    } finally {
      this.loader.hide();
    }
  }

  mostrarHorariosClick() {
    this.mostrarHorarios = true;
  }

  // Función que recibe los horarios que seleccionó el usuario y los guarda en Firestore
  async recibirHorariosSeleccionados(horarios: { [key: string]: string[] }) {
    this.horarios = horarios;
    console.log('Disponibilidad:', horarios);

    if (this.usuario && this.esEspecialista && this.usuario instanceof Especialista) {
      this.usuario.disponibilidad = horarios;
      try {
        await this.usuarioService.updateUsuario(this.usuario);
        console.log('Horarios guardados correctamente.');
      } catch (error) {
        console.error('Error guardando los horarios:', error);
      }
    }
  }

  // Función que cierra el componente de especialidades
  cerrarMostrarHorarios() {
    this.mostrarHorarios = false;
  }
}