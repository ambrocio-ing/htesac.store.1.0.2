import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Producto } from 'src/app/modelo/producto/producto';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vermas-producto',
  templateUrl: './vermas-producto.component.html',
  styleUrls: ['./vermas-producto.component.css']
})
export class VermasProductoComponent implements OnInit {

  @Input() isVisibleModal!:boolean;
  @Input() producto!:Producto;
  @Output() cerrarModal : EventEmitter<boolean> = new EventEmitter();

  url_backend:string = environment.urlBackend + "/mostrar/pto/imagen";

  constructor() { }

  ngOnInit(): void {

  }

  close() : void {
    this.cerrarModal.emit(false);
  }

}
