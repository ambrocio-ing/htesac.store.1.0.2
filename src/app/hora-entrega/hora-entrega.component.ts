import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HoraEntrega } from '../modelo/comprobante/hora-entrega';
import { Variedad } from '../modelo/producto/variedad';
import { HoraEntregaService } from '../servicio/comprobante/hora-entrega.service';
import { LoginService } from '../servicio/login/login.service';
import { VariedadService } from '../servicio/producto/variedad.service';

@Component({
  selector: 'app-hora-entrega',
  templateUrl: './hora-entrega.component.html',
  styleUrls: ['./hora-entrega.component.css']
})
export class HoraEntregaComponent implements OnInit {

  horaEntrega: HoraEntrega = new HoraEntrega();

  horaEntregas: HoraEntrega[] = [];
  errMessageList!: string;
  isNew: boolean = true;

  //Variedades
  /* variedad:Variedad = new Variedad();
  isNewVariedad:boolean = true;
  variedades:Variedad[] = [];
  errMessageVariedades!:string; */

  constructor(private heService: HoraEntregaService, 
    /* private variedadService:VariedadService, */
    public loginService:LoginService) { 

  }

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.heService.listHE().subscribe(resp => {
      this.horaEntregas = resp;
      this.errMessageList = "";
    }, err => {
      this.errMessageList = "Sin datos que mostrar";
    });
  }

  saveHoraEntrega(): void {
    if (this.isNew) {
      this.guardar();
    }
    else {
      this.editar();
    }
  }

  guardar(): void {
    if (this.horaEntrega.idhoraentrega == null && this.horaEntrega.hora != null) {
      this.heService.createHE(this.horaEntrega).subscribe(resp => {
        this.horaEntrega = new HoraEntrega();
        this.ngOnInit();
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa',
          text: resp.mensaje
        });
        
      }, err => {
        if (err.status == 500) {
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
            text: 'No fue posible guardar nuevo registro'
          });
        }

      });
    }
    else {
      Swal.fire({
        icon: 'info',
        title: 'Datos incompletos',
        text: 'Ingrese hora, o refresque y vuelva a intentar'
      });
    }
  }

  obtener(he: HoraEntrega): void {
    this.heService.getHe(he.idhoraentrega).subscribe(resp => {
      this.horaEntrega = resp;
      this.isNew = false;
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Operación fallida',
        text: 'Registro no pudo ser recuperado'
      });
    });
  }

  editar(): void {
    if (this.horaEntrega.idhoraentrega > 0 && this.horaEntrega.hora != null) {
      this.heService.updateHE(this.horaEntrega).subscribe(resp => {
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa',
          text: resp.mensaje
        });
        
        this.horaEntrega = new HoraEntrega();
        this.isNew = true
        this.ngOnInit();
      }, err => {
        if (err.status == 500) {
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
            text: 'No fue posible guardar actualización del registro'
          });
        }

      });
    }
    else {
      Swal.fire({
        icon: 'info',
        title: 'Datos incompletos',
        text: 'Ingrese hora, o refresque y vuelva a intentar'
      });
    }
  }

  eliminar(he: HoraEntrega): void {
    Swal.fire({
      icon:'question',
      title:'Esta intentando eliminar',
      text:'Seguro que desea eliminar, confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si',
      cancelButtonText:'No'
    }).then(res => {
      if(res.value){
        this.heService.deleteHE(he.idhoraentrega).subscribe(resp => {
          Swal.fire({
            icon:'success',
            text:resp.mensaje
          });
          this.ngOnInit();
        }, err => {
          Swal.fire({
            icon:'error',
            text:'No fue posible eliminar registro'
          });
        });
      }
    });
  }

  cancelar(): void {
    this.horaEntrega = new HoraEntrega();
    this.isNew = true;
  }

  //variedades
  /* saveVariedad(): void {
    if(this.isNewVariedad){
      this.guardarVa();
    }
    else{
      this.editarVa();
    }
  }

  guardarVa(): void {
    if(this.variedad.nombre != null && this.variedad.cantidad != null){
      this.variedadService.createVariedad(this.variedad).subscribe(resp => {
        this.variedad = new Variedad();
        this.ngOnInit();
        Swal.fire({
          icon:'success',
          title:'Operación exitosa',
          text:resp.mensaje
        });
      }, err => {
        Swal.fire({
          icon:'error',
          title:'Operación fallida',
          text:'No fue posible guardar nuevo registro'
        });
      });
    }
    else{
      Swal.fire({
        icon:'info',
        title:'Datos incompletos',
        text:'Ingrese todos los datos solicitados e inténtelo de nuevo'
      });
    }
  }

  obtenerVariedad(va:Variedad): void {
    this.variedadService.getVariedad(va.idvariedad).subscribe(resp => {
      this.variedad = resp;
      this.isNewVariedad = false;
    }, err => {      
      Swal.fire({
        icon:'error',
        title:'Operación fallida',
        text:'No fue posible recuperar datos'
      });
    });
  }

  editarVa(): void {
    if(this.variedad.idvariedad > 0 && this.variedad.nombre != null 
        && this.variedad.cantidad != null){

      this.variedadService.updateVariedad(this.variedad).subscribe(resp => {
        this.variedad = new Variedad();
        this.ngOnInit();
        this.isNewVariedad = true;
        Swal.fire({
          icon:'success',
          title:'Operación exitosa',
          text:resp.mensaje
        });
      }, err => {
        Swal.fire({
          icon:'error',
          title:'Operación fallida',
          text:'No fue posible actualizar datos del registro'
        });
      });
    }
    else{
      Swal.fire({
        icon:'info',
        title:'Datos incompletos',
        text:'Ingrese todos los datos solicitados e inténtelo de nuevo'
      });
    }
  }

  cancelarVariedad(): void {
    this.variedad = new Variedad();
    this.isNewVariedad = true;
  }

  eliminarVariedad(va:Variedad): void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea eliminar???',
      text:'Está intentando eliminar registro, confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Sí',
      cancelButtonText:'No'
    }).then(res => {
      if(res.value){
        this.variedadService.deleteVariedad(va.idvariedad).subscribe(resp => {
          this.ngOnInit();
          Swal.fire({
            icon:'success',            
            text:resp.mensaje
          });
        }, err => {
          Swal.fire({
            icon:'error',            
            text:'No fue posible eliminar registro'
          });
        });
      }
    });
  }  */

}
