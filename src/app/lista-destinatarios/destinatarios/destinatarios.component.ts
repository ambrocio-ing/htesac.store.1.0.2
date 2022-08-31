import { Component, OnInit } from '@angular/core';
import { Destinatario } from 'src/app/modelo/destinatario/destinatario';
import { DestinararioService } from 'src/app/servicio/destinatario/destinarario.service';
import { LoginService } from 'src/app/servicio/login/login.service';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-destinatarios',
  templateUrl: './destinatarios.component.html',
  styleUrls: ['./destinatarios.component.css']
})
export class DestinatariosComponent implements OnInit {

  destinatarios:Destinatario[] = [];
  errMessageDes!:string;
  paginator:any = {};

  destinatariosSearchs:Destinatario[] = [];
  errMessageDesSearchs!:string;

  constructor(private desService:DestinararioService, public loginService:LoginService) { }

  ngOnInit(): void {

    this.listar(0);

    this.desService.cbPaginar.subscribe(page => {
      this.listar(page);
    });

  }

  listar(page:number) : void {
    this.desService.listDES(page).subscribe(resp => {
      this.destinatarios = resp.content;
      this.paginator = resp;
      this.errMessageDes = "";
    }, err => {
      this.errMessageDes = "Sin datos que mostrar";
    })
  }

  buscar(value:string) : void {
    if(value != null) {
      this.destinatariosSearchs.length = 0;
      this.desService.getDES(value).subscribe(resp => {
        this.destinatariosSearchs = resp;
        this.errMessageDesSearchs = "";
      }, err => {
        this.errMessageDesSearchs = "Sin datos que mostrar";
      });
    }
    else{
      Swal.fire({
        icon:'info',
        text:'Ingrese documento para continuar'
      });
    }
  }

  limpiar() : void {
    this.destinatariosSearchs.length = 0;
  }

  suspender(des:Destinatario) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea suspender ?',
      text:'Está intentando suspender destinatario, confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si',
      cancelButtonText:'No'
    }).then(res => {
      if(res.value){
        $('#toast_id').removeClass('visually-hidden');
        des.estado = "Suspendido";
        this.desService.updateDES(des).subscribe(resp => {
          $('#toast_id').addClass('visually-hidden');
          this.ngOnInit();
          Swal.fire({
            icon:'success',
            text:resp.mensaje
          });
        }, err => {
          $('#toast_id').addClass('visually-hidden');          
          Swal.fire({
            icon:'error',
            text:'No fue posible cambiar estado'
          });
        });
      }
    });
  }

  activar(des:Destinatario) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea Activar ?',
      text:'Está intentando Activar destinatario, confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si',
      cancelButtonText:'No'
    }).then(res => {
      if(res.value){
        $('#toast_id').removeClass('visually-hidden');
        des.estado = "Activo";
        this.desService.updateDES(des).subscribe(resp => {
          $('#toast_id').addClass('visually-hidden');
          this.ngOnInit();
          Swal.fire({
            icon:'success',
            text:resp.mensaje
          });
        }, err => {
          $('#toast_id').addClass('visually-hidden');          
          Swal.fire({
            icon:'error',
            text:'No fue posible cambiar estado'
          });
        });
      }
    });
  }

}
