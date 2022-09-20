import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Publicacion } from '../modelo/publicacion/publicacion';
import { LoginService } from '../servicio/login/login.service';
import { PublicacionService } from '../servicio/publicacion/publicacion.service';

@Component({
  selector: 'app-gpublicidad',
  templateUrl: './gpublicidad.component.html',
  styleUrls: ['./gpublicidad.component.css']
})
export class GpublicidadComponent implements OnInit {

  publicacion:Publicacion = new Publicacion();
  isNuevo:boolean = true;
  url_backend:string = environment.urlBackend+"/mostrar/publi/imagen";

  publicaciones:Publicacion[] = [];
  errMessageList!:string;

  imagen!:File;
  isValidImage:boolean = false;
  errMessageImage!:string;

  preloader:boolean = false;

  constructor(private puService:PublicacionService, public loginService:LoginService) { }

  ngOnInit(): void {

    this.puService.listPublicacion().subscribe(resp => {
      this.publicaciones = resp;
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

  savePublicacion() : void {
    if(this.isNuevo){
      this.guardar();
    }
    else{
      this.editar();
    }
  }

  guardar() : void {
    this.publicacion.estado = "Vigente";
    if(this.publicacion.idpublicacion == null && this.isValidImage){      
      this.guardarConImagen();
    } 
    else if(this.publicacion.idpublicacion == null && this.isValidImage == false){      
      this.guardarSinImagen();
    }   
  }

  guardarConImagen() : void {
    this.preloader = true;
    this.puService.createPublicacion(this.publicacion, this.imagen).subscribe(resp => {
      this.preloader = false;
      this.cancelar();
      this.ngOnInit();
      Swal.fire({
        icon:'success',
        title:'Operación exitosa',
        text:resp.mensaje
      });
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

  guardarSinImagen() : void {
    this.preloader = true;
    this.puService.create_Publicacion(this.publicacion).subscribe(resp => {
      this.preloader = false;
      this.cancelar();
      this.ngOnInit();
      Swal.fire({
        icon:'success',
        title:'Operación exitosa',
        text:resp.mensaje
      });
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

  obtener(publi:Publicacion) : void {
    this.puService.getPublicacion(publi.idpublicacion).subscribe(resp => {
      this.publicacion = resp;
      this.isNuevo = false;
    }, err => {
      Swal.fire({
        icon:'error',
        title:'Operación fallida',
        text:err.error.mensaje
      });
    });
  }

  editar() : void {
    if(this.publicacion.idpublicacion != null && this.isValidImage){      
      this.editarConImagen();
    } 
    else if(this.publicacion.idpublicacion != null && this.isValidImage == false){      
      this.editarSinImagen();
    }  
  }

  editarConImagen() : void {
    this.preloader = true;
    this.puService.updatePublicacion(this.publicacion, this.imagen).subscribe(resp => {
      this.preloader = false;
      this.cancelar();
      this.ngOnInit();
      Swal.fire({
        icon:'success',
        title:'Operación exitosa',
        text:resp.mensaje
      });
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
    this.preloader = true;
    this.puService.update_Publicacion(this.publicacion).subscribe(resp => {
      this.preloader = false;
      this.cancelar();
      this.ngOnInit();
      Swal.fire({
        icon:'success',
        title:'Operación exitosa',
        text:resp.mensaje
      });
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
    this.publicacion = new Publicacion();
    this.isNuevo = true;
    this.isValidImage = false;
  }

  suspender(publi:Publicacion) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea suspender???',
      text:'Está intentando suspender publicación, confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si, suspender',
      cancelButtonText:'No, suspender'
    }).then(resp => {
      if(resp.value){
        this.preloader = true;
        publi.estado = "Suspendido";
        this.puService.update_Publicacion(publi).subscribe(res => {
          this.preloader = false;
          Swal.fire({
            icon:'success',
            text:'Publicación suspendido con éxito'
          });
        }, err => {
          this.preloader = false;
          Swal.fire({
            icon:'error',
            text:'No fue posible suspender la publicación'
          });
        });
      }
    });
  }

  eliminar(publi:Publicacion) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea eliminar?',
      text:'Está intentando eliminar publicación, confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si, eliminar',
      cancelButtonText:'No, eliminar'
    }).then(resp => {
      if(resp.value){
        this.preloader = true;            
        this.puService.deletePublicacion(publi.idpublicacion).subscribe(res => {
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
            text:'No fue posible eliminar la publicación'
          });
        });
      }
    });
  }

}
