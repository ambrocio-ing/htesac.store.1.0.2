import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/modelo/producto/categoria';
import { Tipo } from 'src/app/modelo/producto/tipo';
import { LoginService } from 'src/app/servicio/login/login.service';
import { CategoriaService } from 'src/app/servicio/producto/categoria.service';
import { TipoService } from 'src/app/servicio/producto/tipo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.css']
})
export class TipoComponent implements OnInit {

  tipo: Tipo = new Tipo();
  tipos: Tipo[] = [];
  errMessageList!: string;

  isNuevo: boolean = true;
  preloader: boolean = false;

  categorias: Categoria[] = [];
  pageCat: number = 0;
  searchCat: string = "";

  constructor(private tipoService: TipoService, 
    private categoriaService: CategoriaService,
    public loginService:LoginService) {
    this.tipo.categoria = new Categoria();
  }

  ngOnInit(): void {

    this.categoriaService.listCategorias().subscribe(resp => {
      this.categorias = resp;
    });

    this.tipoService.listTipos().subscribe(datos => {
      this.tipos = datos;
      this.errMessageList = "";
    }, err => {
      this.errMessageList = "Sin datos que mostrar";
    });

  }

  nextPage(): void {
    this.pageCat += 5;
  }

  previousPage(): void {
    if (this.pageCat >= 5) {
      this.pageCat -= 5;
    }

  }

  onSearchCat(texto: string): void {
    if(this.categorias.length > 0){
      this.pageCat = 0;
      this.searchCat = texto;
    }
    
  }

  seleccionarCat(categoria: Categoria): void {
    this.tipo.categoria = categoria;
  }

  saveTipo(): void {
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
        text: 'Por favor llene los campos solicitados primero'
      });
    }
  }

  guardar(): void {
    this.preloader = true;
    if (this.tipo.idtipo == null && this.tipo.categoria.idcategoria > 0) {
      this.tipoService.createTipo(this.tipo).subscribe(resp => {
        this.preloader = false;
        this.tipo = new Tipo();
        this.tipo.categoria = new Categoria();
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa',
          text: resp.mensaje
        });
        this.ngOnInit();
      }, err => {
        this.preloader = false;
        if (err.status == 400 || err.status == 404 || err.status == 500) {
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
        title: 'Operación no reconocida',
        text: 'Refresque la pagina o precione cancelar y luego intentelo de nuevo'
      });
    }
  }

  obtener(tipo: Tipo): void {
    this.tipoService.getTipo(tipo.idtipo).subscribe(resp => {
      this.isNuevo = false;
      this.tipo = resp;
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Operación fallida',
        text: err.error.mensaje
      });
    });
  }

  editar(): void {
    this.preloader = true;
    if (this.tipo.idtipo != null) {
      this.tipoService.updateTipo(this.tipo).subscribe(resp => {
        this.preloader = false;
        this.isNuevo = true;
        this.tipo = new Tipo();
        this.tipo.categoria = new Categoria();
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa',
          text: resp.mensaje
        });
        this.ngOnInit();
      }, err => {
        this.preloader = false;
        if (err.status == 400 || err.status == 404 || err.status == 500) {
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
        title: 'Operación no reconocida',
        text: 'Refresque la pagina o precione cancelar y luego intentelo de nuevo'
      });
    }
  }

  eliminar(tipo: Tipo): void {
    Swal.fire({
      icon: 'question',
      title: 'Seguro que desea eliminar?',
      text: 'Confirme la acción',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, eliminar'
    }).then((resp: any) => {
      if (resp.value) {
        this.preloader = true;
        this.tipoService.deleteTipo(tipo.idtipo).subscribe(resp => {
          this.preloader = false;
          Swal.fire({
            icon: 'success',
            text: resp.mensaje
          });
          this.ngOnInit();
        }, err => {
          this.preloader = false;
          Swal.fire({
            icon: 'error',
            text: 'No fue posible eliminar registro'
          });
        });
      }
    });
  }

  cancelar(): void {
    this.isNuevo = true;
    this.tipo = new Tipo();
    this.tipo.categoria = new Categoria();
  }

}
