import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductoImagen } from 'src/app/modelo/producto/producto-imagen';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver-imagenes',
  templateUrl: './ver-imagenes.component.html',
  styleUrls: ['./ver-imagenes.component.css']
})
export class VerImagenesComponent implements OnInit {

  @Input() visibleImg:boolean = false;
  @Input() imagenes!:ProductoImagen[];
  @Output() cerrarImg : EventEmitter<boolean> = new EventEmitter();

  url_img = environment.urlBackend + "/mostrar/pto/imagen";

  constructor() { }

  ngOnInit(): void {

  }

  closeModalImg(): void {
    this.cerrarImg.emit(false);
  }

}
