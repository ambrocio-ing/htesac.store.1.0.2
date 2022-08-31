import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Membresia } from '../modelo/membresia/membresia';
import { LoginService } from '../servicio/login/login.service';
import { MembresiaService } from '../servicio/membresia/membresia.service';

@Component({
  selector: 'app-gmembresia',
  templateUrl: './gmembresia.component.html',
  styleUrls: ['./gmembresia.component.css']
})
export class GmembresiaComponent implements OnInit {

  membresia:Membresia = new Membresia();
  isNuevo:boolean = true;

  membresias:Membresia[] = [];
  errMessageList!:string;
  url_backend:string = environment.urlBackend+"/mostrar/mem/imagen";

  imagen!:File;
  isValidImage:boolean = false;
  errMessageImage!:string;

  preloader:boolean = false;

  constructor(private memService:MembresiaService, public loginService:LoginService) { }

  ngOnInit(): void {
    this.listar();
  }

  listar() : void {
    this.memService.listMembresia().subscribe(resp => {
      this.membresias = resp;
      this.errMessageList = "";
    }, err => {
      this.errMessageList = "Sin datos que mostrar";
    });
  }

  capturarImagen(event:any) : void {
    const archivo:File = event.target.files[0];
    if(archivo.type.indexOf("image") < 0){
      this.isValidImage = false;
      this.errMessageImage = "El archivo no es una imagen";
    }
    else{
      this.isValidImage = true;
      this.errMessageImage = "";
      this.imagen = archivo;
    }

  }

  saveMembresia() : void {    
    if(this.isNuevo){
      this.guardar();
    }
    else{
      this.editar();
    }    
  }

  guardar() : void {
    this.preloader = true;
    this.membresia.estado = "Vigente";
    if(this.membresia.idmembresia == null && this.isValidImage){
      this.guardarConImagen();
    }
    else if(this.membresia.idmembresia == null && this.isValidImage == false){
      this.guardarSinImagen();
    }
    else{
      this.preloader =false;
      Swal.fire({
        icon:'info',
        title:'Datos incompletos',
        text:'Operación no reconocida, refresque o cancele e intentelo de nuevo'
      });
    }
  }

  guardarConImagen() : void {
    this.memService.createMembresia(this.membresia, this.imagen).subscribe(resp => {
      this.preloader = false;
      this.cancelar();
      Swal.fire({
        icon:'success',
        title:'Operación exitosa',
        text:resp.mensaje
      });
      this.ngOnInit();

    }, err => {
      console.log('Error en guardar',err);
      this.preloader = false;
      if(err.status == 400 || err.status == 404 || err.status == 500){
        Swal.fire({
          icon:'error',
          title:'Operación fallida',
          text:err.mensaje
        });
      }
      else{
        Swal.fire({
          icon:'error',
          title:'Operación fallida',
          text:'No fue posible establecer conexión, por favor intentelo mas tarde'
        });
      }
    });
  }

  guardarSinImagen() : void {
    this.memService.create_Membresia(this.membresia).subscribe(resp => {
      this.preloader = false;
      this.cancelar();
      Swal.fire({
        icon:'success',
        title:'Operación exitosa',
        text:resp.mensaje
      });
      this.ngOnInit();

    }, err => {      
      this.preloader = false;
      if(err.status == 400 || err.status == 404 || err.status == 500){
        Swal.fire({
          icon:'error',
          title:'Operación fallida',
          text:err.mensaje
        });
      }
      else{
        Swal.fire({
          icon:'error',
          title:'Operación fallida',
          text:'No fue posible establecer conexión, por favor intentelo mas tarde'
        });
      }
    });
  }

  obtener(mem:Membresia) : void {
    this.preloader = true;
    this.memService.getMembresia(mem.idmembresia).subscribe(resp => {
      this.preloader = false;
      this.membresia = resp;
      this.isNuevo = false;
    }, err => {
      this.preloader = false;
      Swal.fire({
        icon:'info',
        title:'No fue posible recuperar datos',
        text:'No fue posible recuperar datos delregistro, intentelo de nuevo'
      });
    });
  }

  editar() : void {
    this.preloader = true;
    //this.membresia.estado = "Vigente";
    if(this.membresia.idmembresia != null && this.isValidImage){
      this.editarConImagen();
    }
    else if(this.membresia.idmembresia != null && this.isValidImage == false){
      this.editarSinImagen();
    }
    else{
      this.preloader =false;
      Swal.fire({
        icon:'info',
        title:'Datos incompletos',
        text:'Operación no reconocida, refresque o cancele e intentelo de nuevo'
      });
    }
  }

  editarConImagen() : void {
    this.memService.updateMembresia(this.membresia, this.imagen).subscribe(resp => {
      this.preloader = false;
      this.cancelar();
      Swal.fire({
        icon:'success',
        title:'Operación exitosa',
        text:resp.mensaje
      });
      this.ngOnInit();

    }, err => {
      this.preloader = false;
      if(err.status == 400 || err.status == 404 || err.status == 500){
        Swal.fire({
          icon:'error',
          title:'Operación fallida',
          text:err.error.mensaje
        });
      }
      else{
        Swal.fire({
          icon:'error',
          title:'Operación fallida',
          text:'No fue posible establecer conexión, por favor intentelo mas tarde'
        });
      }
    });
  }

  editarSinImagen() : void {
    this.memService.update_Membresia(this.membresia).subscribe(resp => {
      this.preloader = false;
      this.cancelar();
      Swal.fire({
        icon:'success',
        title:'Operación exitosa',
        text:resp.mensaje
      });
      this.ngOnInit();

    }, err => {
      this.preloader = false;
      if(err.status == 400 || err.status == 404 || err.status == 500){
        Swal.fire({
          icon:'error',
          title:'Operación fallida',
          text:err.error.mensaje
        });
      }
      else{
        Swal.fire({
          icon:'error',
          title:'Operación fallida',
          text:'No fue posible establecer conexión, por favor intentelo mas tarde'
        });
      }
    });
  }

  cancelar() : void {
    this.membresia = new Membresia();
    this.isNuevo = true;
    this.isValidImage = false;    
  }

  suspender(mem:Membresia) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea suspender???',
      text:'Está intentando suspender membresia, confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si, suspender',
      cancelButtonText:'No, suspender'
    }).then(resp => {
      if(resp.value){
        this.preloader = true;
        mem.estado = "Suspendido";
        this.memService.update_Membresia(mem).subscribe(res => {
          this.preloader = false;
          Swal.fire({
            icon:'success',
            text:'Membresia suspendido con éxito'
          });
        }, err => {
          this.preloader = false;
          Swal.fire({
            icon:'error',
            text:'No fue posible suspender la membresia'
          });
        });
      }
    });
  }

  eliminar(mem:Membresia) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea eliminar?',
      text:'Está intentando eliminar membresia, confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si, eliminar',
      cancelButtonText:'No, eliminar'
    }).then(resp => {
      if(resp.value){
        this.preloader = true;            
        this.memService.deleteMembresia(mem.idmembresia).subscribe(res => {
          this.preloader = false;
          Swal.fire({
            icon:'success',
            text:res.mensaje
          });
          this.ngOnInit();
        }, err => {          
          this.preloader = false;
          Swal.fire({
            icon:'error',
            text:'No fue posible eliminar la membresia'
          });
        });
      }
    });
  }

}
