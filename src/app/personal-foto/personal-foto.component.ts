import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Personal } from '../modelo/personal/personal';
import { PersonalService } from '../servicio/personal/personal.service';

@Component({
  selector: 'app-personal-foto',
  templateUrl: './personal-foto.component.html',
  styleUrls: ['./personal-foto.component.css']
})
export class PersonalFotoComponent implements OnInit {

  @Input() estadoModal:boolean = false;
  @Input() personal!:Personal;
  @Output() cerrarModal : EventEmitter<boolean> = new EventEmitter();

  url_backend = environment.urlBackend + "/mostrar/per/imagen";
  

  foto!: File;
  isValidFoto: boolean = false;
  foto_perfil_error!:string;

  constructor(private personalService:PersonalService) { }

  ngOnInit(): void {

  }

  capturarImagen(event: any): void {
    const archivo: File = event.target.files[0];
    if (archivo.type.indexOf("image") < 0) {
      this.foto_perfil_error = "El archivo no es una imagen";
      this.isValidFoto = false;
    }
    else {
      this.foto = archivo;
      this.foto_perfil_error = "";
      this.isValidFoto = true;
    }
  }

  guardar() : void {
    if(this.isValidFoto && this.personal.persona.dni != null){
      this.personalService.uploadFoto(this.personal.persona.dni, this.foto).subscribe(resp => {
        Swal.fire({
          icon:'success',
          title:'Operación exitosa',
          text:resp.mensaje
        });
        this.personal.persona.fotoPerfil = resp.nombre_foto;
      }, err => {
        Swal.fire({
          icon:'error',
          title:'Operación fallida',
          text:'Foto no guardado, por favor intentelo denuevo'
        });
      });
    }
    else{
      Swal.fire({
        icon:'info',
        title:'Datos incompletos',
        text:'Primero seleccione una imagen'
      });
    }
  }

  cerrar() : void {    
    this.cerrarModal.emit(false);
  }

}
