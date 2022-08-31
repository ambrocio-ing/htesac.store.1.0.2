import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/modelo/producto/categoria';
import { LoginService } from 'src/app/servicio/login/login.service';
import { CategoriaService } from 'src/app/servicio/producto/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  categoria:Categoria = new Categoria();
  categorias:Categoria[] = [];
  errMessageList!:string;

  isNuevo:boolean = true;
  preloader:boolean = false;

  constructor(private categoriaService:CategoriaService, public loginService:LoginService) { }

  ngOnInit(): void {

    this.categoriaService.listCategorias().subscribe(datos => {
      this.categorias = datos;
      this.errMessageList = "";
    }, err => {
      this.errMessageList = "Sin datos que mostrar";
    });

  }

  saveCategoria(): void {
    if(this.isNuevo){
      this.guardar();
    }
    else if(!this.isNuevo){
      this.editar()
    }
    else{
      Swal.fire({
        icon:'info',
        title:'Acción no reconocido',
        text:'No fue posible determinar si es nuevo o no el registro'
      });
    }
  }

  guardar() : void {    
    this.preloader = true;
    if(this.categoria.idcategoria == null){
      console.log(this.categoria);
      this.categoriaService.createCategoria(this.categoria).subscribe(resp => {
        this.preloader = false;
        this.categoria = new Categoria();
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
    else{
      this.preloader = false;
    }
  }

  obtener(categoria:Categoria) : void {
    this.categoriaService.getCategoria(categoria.idcategoria).subscribe(resp => {
      this.isNuevo = false;
      this.categoria = resp;      
    }, err => {
      Swal.fire({
        icon:'error',
        title:'Operación fallida',
        text:err.error.mensaje
      });
    });
  }

  editar() : void {
    this.preloader = true;
    if(this.categoria.idcategoria != null){
      this.categoriaService.updateCategoria(this.categoria).subscribe(resp => {
        this.preloader = false;
        this.isNuevo = true;
        this.categoria = new Categoria();
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
    else{
      this.preloader = false;
    }
  }

  eliminar(categoria:Categoria) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea eliminar?',
      text:'Confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si, eliminar',
      cancelButtonText:'No, eliminar'
    }).then((resp:any) => {
      if(resp.value){
        this.preloader = true;
        this.categoriaService.deleteCategoria(categoria.idcategoria).subscribe(resp => {
          this.preloader = false;
          Swal.fire({
            icon:'success',
            text:resp.mensaje
          });
          this.ngOnInit();
        }, err => {
          this.preloader = false;
          Swal.fire({
            icon:'error',
            text:'No fue posible eliminar registro'
          });
        });
      }
    });
  }

  cancelar() : void {
    this.categoria = new Categoria();
    this.isNuevo = true;
  }

}
