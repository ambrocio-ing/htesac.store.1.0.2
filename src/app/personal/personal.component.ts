import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Persona } from '../modelo/persona/persona';
import { Personal } from '../modelo/personal/personal';
import { environment } from 'src/environments/environment';
import { Usuario } from '../modelo/seguridad/usuario/usuario';
import Swal from 'sweetalert2';
import { PersonalService } from '../servicio/personal/personal.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  @ViewChild("asRolAdmin") chkAdmin!: ElementRef;  

  url_backend = environment.urlBackend + "/mostrar/per/imagen";

  personal: Personal = new Personal();
  personals: Personal[] = [];
  listaMensaje!: string;

  isNuevo: boolean = true;

  roles: string[] = [];

  personalSeleccionado!: Personal;
  isVisibleModal: boolean = false;

  preloader: boolean = false;

  constructor(private personalService: PersonalService, private renderer: Renderer2) {
    this.personal.persona = new Persona();
    this.personal.usuario = new Usuario();
  }

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.personalService.getPersonals().subscribe(resp => {
      this.personals = resp;
      this.listaMensaje = "";
    }, err => {
      this.listaMensaje = "Sin datos que mostrar";
    });
  }

  savePersonal(): void {
    if (this.isNuevo) {
      this.guardar();
    }
    else if (!this.isNuevo) {
      this.editar();
    }
    else {
      Swal.fire({
        icon: 'info',
        title: 'Datos incompletos',
        text: 'Ocurrio un error inespedado, por favor refresque la pagina y vuelva intentarlo'
      });
    }
  }

  guardar(): void {
    this.preloader = true;
    this.personal.usuario.roles = this.roles;
    this.personal.usuario.estado = "Activo";
    if (this.personal.idpersonal == null) {
  
      this.personalService.create_Personal(this.personal).subscribe(resp => {
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa',
          text: resp.mensaje
        });
        this.ngOnInit();
        this.preloader = false;
        this.cancelar();
        this.unCheckRol();        
      }, err => {
        this.preloader = false;
        if (err.status == 400 || err.status == 500 || err.status == 404) {
          Swal.fire({
            icon: 'error',
            title: 'Operación fallida',
            text: err.error.mensaje
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Operación fallida',
            text: 'No fue posible establecer conexión, por favor intentelo mas tarde'
          });
        }
      });
    }
    else {
      this.preloader = false;
      Swal.fire({
        icon: 'info',
        title: 'El registro no es nuevo',
        text: 'Ocurrio un error inespedado, por favor refresque la pagina y vuelva intentarlo'
      });
    }
  }

  obtener(personal: Personal): void {
    this.preloader = true;
    this.personalService.getPersonal(personal.idpersonal).subscribe(resp => {
      this.personal = resp;
      this.personal.usuario.password = "noeditar";
      this.chekarRol();
      this.isNuevo = false;
      this.preloader = false;
    
    }, err => {
      this.preloader = false;
      Swal.fire({
        icon: 'error',
        title: 'Operación fallida',
        text: 'No fue posible recuperar registro'
      });
    });
  }

  editar(): void {
    this.preloader = true;
    this.personal.usuario.roles = this.roles;
    this.personal.usuario.estado = this.personal.estado;
    if (this.personal.idpersonal > 0) {
    
      this.personalService.updatePersonal(this.personal).subscribe(resp => {
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa',
          text: resp.mensaje
        });
        this.ngOnInit();
        this.preloader = false;
        this.cancelar();
        this.unCheckRol();        
      }, err => {
        this.preloader = false;
        if (err.status == 400 || err.status == 500 || err.status == 404) {
          Swal.fire({
            icon: 'error',
            title: 'Operación fallida',
            text: err.error.mensaje
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Operación fallida',
            text: 'No fue posible establecer conexión, por favor intentelo mas tarde'
          });
        }
      }); 
    }
    else {
      this.preloader = false;
      Swal.fire({
        icon: 'info',
        title: 'El registro no es nuevo',
        text: 'Ocurrio un error inespedado, por favor refresque la pagina y vuelva intentarlo'
      });
    }
  }

  eliminar(personal: Personal): void {
    Swal.fire({
      icon: 'question',
      title: 'Seguro que desea eliminar?',
      text: 'Por favor confirme la acción',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, eliminar'
    }).then(resp => {
      if (resp.value) {
        this.preloader = true;
        this.personalService.deletePersonal(personal.idpersonal).subscribe(res => {
          Swal.fire({
            icon: 'success',
            text: res.mensaje
          });
          this.ngOnInit();
          this.preloader = false;
        }, err => {
          this.preloader = false;
          if (err.status == 400 || err.status == 500 || err.status == 404) {
            Swal.fire({
              icon: 'error',
              title: 'Operación fallida',
              text: err.error.mensaje
            });
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Operación fallida',
              text: 'No fue posible establecer conexión, por favor intentelo mas tarde'
            });
          }
        });
      }
    });
  }  

  rolAdmin(event: any): void {

    if (event.target.checked) {
      const indice = this.roles.indexOf("admin");
      if (indice == -1) {
        this.roles.push("admin");
      }
    }
    else {
      this.roles.length = 0;
    }    
  }    

  chekarRol(): void {   
    const rroles: string[] = this.personal.usuario.roles; 
    const indice = rroles.indexOf("ROLE_ADMIN");
    if (indice != -1) {
      const admin = this.chkAdmin.nativeElement;
      this.renderer.setAttribute(admin, "checked", "true");
      this.roles.push("admin");
      this.personal.usuario.roles = this.roles;
    }    
  }

  cancelar(): void {
    this.personal = new Personal();
    this.personal.persona = new Persona();
    this.personal.usuario = new Usuario();
    this.isNuevo = true;
    this.unCheckRol();
    this.roles.length = 0;
  }

  irModal(personal: Personal): void {
    this.isVisibleModal = true;
    this.personalSeleccionado = personal;
  }

  unCheckRol(): void {   

    const admin = this.chkAdmin.nativeElement;
    this.renderer.removeAttribute(admin, "checked");
  }

}
