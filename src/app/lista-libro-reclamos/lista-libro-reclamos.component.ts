import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LibroReclamo } from '../modelo/libro-reclamo/libro-reclamo';
import { LibroReclamoService } from '../servicio/libro-reclamo/libro-reclamo.service';
import { LoginService } from '../servicio/login/login.service';

declare var $: any;

@Component({
  selector: 'app-lista-libro-reclamos',
  templateUrl: './lista-libro-reclamos.component.html',
  styleUrls: ['./lista-libro-reclamos.component.css']
})
export class ListaLibroReclamosComponent implements OnInit {

  libro: LibroReclamo = new LibroReclamo();
  libros: LibroReclamo[] = [];
  preloader: boolean = false;
  errMessageLib!: string;
  paginator: any = {};

  constructor(private libroService: LibroReclamoService, public loginService:LoginService) { }

  ngOnInit(): void {

    this.listar(0);

    this.libroService.cbPaginar.subscribe(page => {
      this.listar(page);
    });

  }

  listar(page: number): void {
    this.libroService.listLibroReclamo(page).subscribe(resp => {
      this.libros = resp.content;
      this.paginator = resp;
      this.errMessageLib = "";
    }, err => {
      this.errMessageLib = "Sin datos que mostrar";
    });
  }

  editarLibro(): void {
    if (this.libro.respuesta.length > 0) {
      this.preloader = true;
      this.libroService.updateLibroReclamo(this.libro).subscribe(resp => {
        this.preloader = false;
        this.libro = new LibroReclamo();
        Swal.fire({
          icon: 'success',
          text: resp.mensaje
        }).then(resp => {
          $('#modalCustom').removeClass('visually-hidden');
        });
      }, err => {
        this.preloader = false;
        Swal.fire({
          icon: 'error',
          text: 'No fue posible guardar su respuesta, inténtelo mas tarde'
        });
      });
    }
    else {
      Swal.fire({
        icon: 'info',
        text: 'Datos incompletos, ingrese su respuesta para continuar'
      });
    }

  }

  respuesta(libro: LibroReclamo): void {
    $('#modalCustom').removeClass('visually-hidden');
    this.libro = libro;
  }

  cerrarModal(): void {
    $('#modalCustom').addClass('visually-hidden');
    this.libro = new LibroReclamo();
  }

}
