import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DetallePago } from 'src/app/modelo/comprobante/detalle-pago';

@Component({
  selector: 'app-modal-detalle-pago',
  templateUrl: './modal-detalle-pago.component.html',
  styleUrls: ['./modal-detalle-pago.component.css']
})
export class ModalDetallePagoComponent implements OnInit {

  @Input() detallePago!:DetallePago;
  @Input() visibleModal!:boolean;
  @Output() cerrarModal : EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    
  }

  closeModalDetallePago(): void {
    this.cerrarModal.emit(false);
  }

}
