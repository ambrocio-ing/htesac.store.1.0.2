import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Categoria } from 'src/app/modelo/producto/categoria';
import { Tipo } from 'src/app/modelo/producto/tipo';
import { TipoService } from '../../servicio/producto/tipo.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Producto } from 'src/app/modelo/producto/producto';
import { ProductoDatoNutricional } from 'src/app/modelo/producto/producto-dato-nutricional';
import { ProductoVestimenta } from 'src/app/modelo/producto/producto-vestimenta';
import { ProductoOtros } from 'src/app/modelo/producto/producto-otros';
import { ProductoService } from 'src/app/servicio/producto/producto.service';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  @ViewChild("chk_alimento") chkal!: ElementRef;
  @ViewChild("chk_vestimenta") chkves!: ElementRef;
  @ViewChild("chk_otro") chkot!: ElementRef;

  tipos: Tipo[] = [];
  pageTip: number = 0;
  searchTip: string = "";

  imagenes: File[] = [];
  imageNames: string[] = [];

  //producto
  producto: Producto = new Producto;
  preloader: boolean = false;

  isAlimento: boolean = false;
  isVestimenta: boolean = false;
  isOtro: boolean = false;  

  constructor(private tipoService: TipoService, private sanitizer: DomSanitizer,
    private productoService: ProductoService, private render: Renderer2) {

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
        icon: 'warning',
        text: 'El archivo no es una imagen o supera los 10MB'
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

  eliminarImagen(nimg: string): void {
    const indice = this.imageNames.indexOf(nimg);
    if (indice != -1) {
      this.imageNames.splice(indice, 1);
      this.imagenes.splice(indice, 1);
      console.log("***NUEVO**", this.imagenes);
    }
  }


  saveProducto(): void {
    this.preloader = true;
    if (this.producto.idproducto == null &&
      this.producto.tipo.idtipo > 0 && this.imagenes.length > 0) {

      this.producto.nventas = 0;
      this.producto.nestrellas = 5;
      console.log("******", this.producto);
      this.productoService.createProductoWithImage(this.producto, this.imagenes).subscribe(resp => {
        this.preloader = false;
        this.cancelar();
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa',
          text: resp.mensaje
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
    else {
      this.preloader = false;
      Swal.fire({
        icon: 'info',
        title: 'Datos incompletos',
        text: 'Es posible que no haya seleccionado categoria, tipo o imagenes'
      });
    }
  }

  cancelar(): void {
    this.producto = new Producto();
    this.producto.tipo = new Tipo();
    this.producto.tipo.categoria = new Categoria();
    this.producto.productoDatoNutricional = new ProductoDatoNutricional();
    this.producto.productoVestimenta = new ProductoVestimenta();
    this.producto.productoImagenes.length = 0;
    this.producto.productoOtros = new ProductoOtros();
    this.imagenes.length = 0;
    this.imageNames.length = 0;
  }

  categoriaAlimento(event: any): void {
    if (event.target.checked) {
      this.isAlimento = true;

      if (this.isVestimenta) {
        //$('#chk_vestimenta').prop('ckecked', false);
        const chkvestimenta = this.chkves.nativeElement;
        this.render.setProperty(chkvestimenta, 'checked', false);
        this.producto.productoVestimenta = new ProductoVestimenta();
        this.isVestimenta = false;
      }

      if (this.isOtro) {
        //$('#chk_otro').attr('ckecked', false);
        const chkotro = this.chkot.nativeElement;
        this.render.setProperty(chkotro, 'checked', false);
        this.producto.productoOtros = new ProductoOtros();
        this.isOtro = false;
      }

    }
    else {
      this.isAlimento = false;
      this.producto.productoDatoNutricional = new ProductoDatoNutricional();
    }

  }

  categoriaVestimenta(event: any): void {
    if (event.target.checked) {
      /* let vari:Variedad = new Variedad();
      vari.idvariedad = 1;
      vari.nombre = "Default";
      vari.cantidad = 0;
      this.producto.productoVestimenta.variedades.push(vari); */
      this.isVestimenta = true;

      if (this.isAlimento) {
        //$('#chk_alimento').prop('ckecked', false);
        const chkalimento = this.chkal.nativeElement;
        this.render.setProperty(chkalimento, 'checked', false);
        this.producto.productoDatoNutricional = new ProductoDatoNutricional();
        this.isAlimento = false;
      }

      if (this.isOtro) {
        //$('#chk_otro').prop('ckecked', false);
        const chkotro = this.chkot.nativeElement;
        this.render.setProperty(chkotro, 'checked', false);
        this.producto.productoOtros = new ProductoOtros();
        this.isOtro = false;
      }

    }
    else {
      this.isVestimenta = false;
      this.producto.productoVestimenta = new ProductoVestimenta();
    }

  }

  categoriaOtro(event: any): void {

    if (event.target.checked) {
      this.isOtro = true;

      if (this.isAlimento) {
        //$('#chk_alimento').prop('ckecked', false);
        const chkalimento = this.chkal.nativeElement;
        this.render.setProperty(chkalimento, 'checked', false);
        this.producto.productoDatoNutricional = new ProductoDatoNutricional();
        this.isAlimento = false;
      }

      if (this.isVestimenta) {
        //$('#chk_vestimenta').prop('ckecked', false);
        const chkvestimenta = this.chkves.nativeElement;
        this.render.setProperty(chkvestimenta, 'checked', false);
        this.producto.productoVestimenta = new ProductoVestimenta();
        this.isVestimenta = false;
      }

    }
    else {
      this.isOtro = false;
      this.producto.productoOtros = new ProductoOtros();
    }

  }  

}
