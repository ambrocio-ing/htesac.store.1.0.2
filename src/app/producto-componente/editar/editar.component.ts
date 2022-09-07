import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/modelo/producto/categoria';
import { Producto } from 'src/app/modelo/producto/producto';
import { ProductoDatoNutricional } from 'src/app/modelo/producto/producto-dato-nutricional';
import { ProductoImagen } from 'src/app/modelo/producto/producto-imagen';
import { ProductoOtros } from 'src/app/modelo/producto/producto-otros';
import { ProductoVestimenta } from 'src/app/modelo/producto/producto-vestimenta';
import { Tipo } from 'src/app/modelo/producto/tipo';
import { ProductoService } from 'src/app/servicio/producto/producto.service';
import { TipoService } from 'src/app/servicio/producto/tipo.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  url_backend = environment.urlBackend + "/mostrar/pto/imagen";

  tipos: Tipo[] = [];
  pageTip: number = 0;
  searchTip: string = "";

  producto: Producto = new Producto();
  errMessage!: string;
  preloader: boolean = false;  

  imagenes: File[] = [];
  imageNames:string[] = [];  

  constructor(private productoService: ProductoService,
    private activatedRoute: ActivatedRoute, private router: Router,
    private tipoService: TipoService, private sanitizer: DomSanitizer) {

    this.producto.tipo = new Tipo();
    this.producto.tipo.categoria = new Categoria();
    this.producto.productoDatoNutricional = new ProductoDatoNutricional();
    this.producto.productoVestimenta = new ProductoVestimenta();    
    this.producto.productoOtros = new ProductoOtros();    
  }

  ngOnInit(): void {

    this.tipoService.listTipos().subscribe(resp => {
      this.tipos = resp;
    });

    this.activatedRoute.paramMap.subscribe(param => {
      const id = param.get('id');
      if (id != null) {
        this.productoService.getProducto(+id).subscribe(resp => {
          this.producto = resp;
          this.errMessage = "";
        }, err => {
          this.errMessage = "No se a podido recuperar el registro";
        });
      }
    });    

  }

  nextTip(): void {
    this.pageTip += 5;
  }

  previousTip(): void {
    if (this.pageTip > 0) {
      this.pageTip -= 5;
    }

  }

  onSearchTip(texto: string) {
    this.pageTip = 0;
    this.searchTip = texto;
  }

  seleccionarTipo(tipo: Tipo): void {
    this.producto.tipo = tipo;
  }

  //imagenes
  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const imagen = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };

    } catch (e) {

    }
  });

  capturarImagen(event: any): void {
    const archivo: File = event.target.files[0];    
    if (archivo.type.indexOf("image") == -1 || archivo.size > 10000000) {
      Swal.fire({
        icon:'warning',
        text:'El archivo no es una imagen o supera los 10MB'
      });
    }
    else {
      this.imagenes.push(archivo);
      this.extraerBase64(archivo).then((imagen: any) => {
        this.imageNames.push(imagen.base);
        console.log("**IMAGENES NAMES**", this.imageNames);
      });
      console.log("**IMAGENES**", this.imagenes);
    }
  }

  eliminarImagen(nimg:string): void {
    const indice = this.imageNames.indexOf(nimg);
    if(indice != -1){
      this.imageNames.splice(indice, 1);
      this.imagenes.splice(indice, 1);
      console.log("***NUEVO**", this.imagenes);
    }
  }  

  eliminarImagenId(nimg:ProductoImagen): void {
    Swal.fire({
      icon:'question',
      text:'Seguro que desea eliminar imagen???',
      showCancelButton:true,
      confirmButtonText:'Sí',
      cancelButtonText:'No'
    }).then(res => {
      if(res.value){
        this.productoService.deleteImg(nimg.idpimagen).subscribe(resp => {
          Swal.fire({
            icon:'success',
            text:resp.mensaje
          });

          this.ngOnInit();

        }, err => {
          Swal.fire({
            icon:'error',
            text:'No fue posible eliminar imagen'
          });
        });
      }
    });
  } 

  //acciones
  updateProducto(): void {
    this.preloader = true;
    if (this.producto.idproducto > 0 && this.producto.tipo.categoria.idcategoria > 0 &&
      this.producto.tipo.idtipo > 0) {     

      if (this.imagenes.length > 0) {

        this.productoService.updateProducto(this.producto, this.imagenes).subscribe(resp => {
          this.preloader = false;
          Swal.fire({
            icon: 'success',
            title: 'Operación exitosa',
            text: resp.mensaje
          }).then(res => {
            this.router.navigate(['pro-lista']);
          });
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
      else{
        this.productoService.update_Producto(this.producto).subscribe(resp => {
          this.preloader = false;
          Swal.fire({
            icon: 'success',
            title: 'Operación exitosa',
            text: resp.mensaje
          }).then(res => {
            this.router.navigate(['pro-lista']);
          });
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

    }
    else {
      this.preloader = false;
      Swal.fire({
        icon: 'info',
        title: 'Datos incompletos',
        text: 'Los ids asociados no se han podido indentificar'
      });
    }
  }  

}
