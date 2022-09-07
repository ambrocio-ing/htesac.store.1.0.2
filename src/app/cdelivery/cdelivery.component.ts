import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Delivery } from '../modelo/delivery/delivery';
import { DeliveryService } from '../servicio/delivery/delivery.service';
import { LoginService } from '../servicio/login/login.service';

@Component({
  selector: 'app-cdelivery',
  templateUrl: './cdelivery.component.html',
  styleUrls: ['./cdelivery.component.css']
})
export class CdeliveryComponent implements OnInit {

  delivery:Delivery = new Delivery();  
  isNuevo:boolean = true;

  deliverys:Delivery[] = [];
  errMessageDels!:string;

  preloader:boolean = false;

  constructor(private delService:DeliveryService, public loginService:LoginService) { }

  ngOnInit(): void {
    this.listar();
  }

  listar() : void {
    this.delService.listDeliverys().subscribe(resp => {
      this.deliverys = resp;
      this.errMessageDels = "";
    }, err => {
      this.errMessageDels = "Sin datos que mostrar";
    });
  }

  saveDelivery() : void {

    if(this.isNuevo && this.delivery.iddelivery == null){
      this.guardar();
    }
    else{
      this.editar();
    }

  }

  guardar() : void {
    this.preloader = true;
    this.delService.createDelivery(this.delivery).subscribe(resp => {
      this.preloader = false;
      this.delivery = new Delivery();
      Swal.fire({
        icon:'success',
        title:'Registro guardado',
        text:resp.mensaje
      });
      this.ngOnInit();
    }, err => {
      this.preloader = false;
      if(err.status == 400 || err.status == 404){
        Swal.fire({
          icon:'error',
          title:'Tarea fallida',
          text: err.error.mensaje
        });
      }
      else{
        Swal.fire({
          icon:'error',
          title:'Tarea fallida',
          text:'No fue posible guardar registro, por favor inténtelo mas tarde'
        });
      }
     
    });
  }

  obtener(del:Delivery) : void {
    this.preloader = true;
    this.delService.getDelivery(del.iddelivery).subscribe(resp => {
      this.preloader = false;
      this.isNuevo = false;
      this.delivery = resp;
      this.ngOnInit();
    }, err => {
      this.preloader = false;
      Swal.fire({
        icon:'error',
        title:'Tarea fallida',
        text:'No se encontro coincidencias'
      });
    });
  }

  editar() : void {
    this.preloader = true;
    this.delService.updateDelivery(this.delivery).subscribe(resp => {
      this.preloader = false;
      this.isNuevo = true;
      this.delivery = new Delivery();
      Swal.fire({
        icon:'success',
        title:'Registro guardado',
        text:resp.mensaje
      });
      this.ngOnInit();
    }, err => {
      this.preloader = false;
      Swal.fire({
        icon:'error',
        title:'Tarea fallida',
        text:'No fue posible guardar registro, por favor inténtelo mas tarde'
      });
    });
  }

  eliminar(del:Delivery) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea eliminar ?',
      text:'Está intentando eliminar, confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si',
      cancelButtonText:'No'
    }).then(res => {
      if(res.value){
        this.delService.deleteDelivery(del.iddelivery).subscribe(resp => {
          this.ngOnInit();
          Swal.fire({
            icon:'success',
            text:resp.mensaje
          });
        }, err => {
          Swal.fire({
            icon:'error',
            text:'No fue posible eliminar registro, inténtelo mas tarde'
          });
        });
      }
    });
  }

  cancelar() : void {
    this.delivery = new Delivery();
    this.isNuevo = true;
  }

}
