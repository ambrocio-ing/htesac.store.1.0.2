import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { PanelComponent } from './panel/panel.component';
import { GpublicidadComponent } from './gpublicidad/gpublicidad.component';

import { GmembresiaComponent } from './gmembresia/gmembresia.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { LoginComponent } from './login/login.component';
import { CmarcaComponent } from './cmarca/cmarca.component';
import { RecuperarCComponent } from './recuperar-c/recuperar-c.component';
import { NuevaCComponent } from './nueva-c/nueva-c.component';
import { PersonalComponent } from './personal/personal.component';
import { PersonalFotoComponent } from './personal-foto/personal-foto.component';
import { ListaComponent } from './producto-componente/lista/lista.component';
import { NuevoComponent } from './producto-componente/nuevo/nuevo.component';
import { CategoriaComponent } from './producto-componente/categoria/categoria.component';
import { TipoComponent } from './producto-componente/tipo/tipo.component';
import { FiltroPipe } from './modelo/producto/filtro.pipe';
import { FiltroTipoPipe } from './modelo/producto/filtro-tipo.pipe';
import { EditarComponent } from './producto-componente/editar/editar.component';
import { PaginadorListaComponent } from './producto-componente/paginador-lista/paginador-lista.component';
import { NuevoIngresoComponent } from './compra-venta/ingreso/nuevo-ingreso/nuevo-ingreso.component';
import { ListaIngresoComponent } from './compra-venta/ingreso/lista-ingreso/lista-ingreso.component';
import { SeleccionProductoComponent } from './compra-venta/ingreso/seleccion-producto/seleccion-producto.component';
import { VermasProductoComponent } from './compra-venta/ingreso/vermas-producto/vermas-producto.component';
import { EditarIngresoComponent } from './compra-venta/ingreso/editar-ingreso/editar-ingreso.component';
import { OfertaClienteComponent } from './compra-venta/oferta/oferta-cliente/oferta-cliente.component';
import { OfertaProveedorComponent } from './compra-venta/oferta/oferta-proveedor/oferta-proveedor.component';
import { PendientePaginadorComponent } from './compra-venta/oferta/pendiente-paginador/pendiente-paginador.component';
import { AceptadoPaginadorComponent } from './compra-venta/oferta/aceptado-paginador/aceptado-paginador.component';
import { RechazadoPaginadorComponent } from './compra-venta/oferta/rechazado-paginador/rechazado-paginador.component';
import { CliPaginadorComponent } from './clientes/cli-paginador/cli-paginador.component';
import { CliVerComponent } from './clientes/cli-ver/cli-ver.component';
import { ProveedorListaComponent } from './proveedor/proveedor-lista/proveedor-lista.component';
import { ProveedorPaginadorComponent } from './proveedor/proveedor-paginador/proveedor-paginador.component';
import { ListaVendidosComponent } from './compra-venta/venta/lista-vendidos/lista-vendidos.component';
import { ListaPedidosComponent } from './compra-venta/venta/lista-pedidos/lista-pedidos.component';
import { ListaAnuladosComponent } from './compra-venta/venta/lista-anulados/lista-anulados.component';
import { BusquedaVentasComponent } from './compra-venta/venta/busqueda-ventas/busqueda-ventas.component';
import { PaginadorGeneralComponent } from './compra-venta/venta/paginador-general/paginador-general.component';
import { ListaGeneralComponent } from './compra-venta/venta/lista-general/lista-general.component';
import { VerDireccionEnvioComponent } from './compra-venta/venta/ver-direccion-envio/ver-direccion-envio.component';
import { ListaReclamosComponent } from './reclamos/lista-reclamos/lista-reclamos.component';
import { PaginadorReclamosComponent } from './reclamos/paginador-reclamos/paginador-reclamos.component';
import { CdeliveryComponent } from './cdelivery/cdelivery.component';
import { ListaLibroReclamosComponent } from './lista-libro-reclamos/lista-libro-reclamos.component';
import { ListaLibroPaginadorComponent } from './lista-libro-reclamos/lista-libro-paginador/lista-libro-paginador.component';
import { DestinatariosComponent } from './lista-destinatarios/destinatarios/destinatarios.component';
import { DestinatariosPaginadorComponent } from './lista-destinatarios/destinatarios-paginador/destinatarios-paginador.component';
import { ListaSujerenciaComponent } from './compra-venta/oferta/lista-sujerencia/lista-sujerencia.component';
import { PaginadorSujerenciaComponent } from './compra-venta/oferta/paginador-sujerencia/paginador-sujerencia.component';
import { InicioComponent } from './inicio/inicio.component';
import { TokenInterceptor } from './servicio/interceptor/token-interceptor';
import { HoraEntregaComponent } from './hora-entrega/hora-entrega.component';
import { ModalDetallePagoComponent } from './compra-venta/venta/modal-detalle-pago/modal-detalle-pago.component';
import { VerImagenesComponent } from './producto-componente/ver-imagenes/ver-imagenes.component';
import { PvariedadPipe } from './modelo/producto/pvariedad.pipe';
import { ListaPendientesPorProductoComponent } from './compra-venta/venta/lista-pendientes-por-producto/lista-pendientes-por-producto.component';

@NgModule({
  declarations: [
    AppComponent,
    PanelComponent,
    GpublicidadComponent,  
    GmembresiaComponent,     
    ClientesComponent,
    ComentariosComponent,   
    LoginComponent,    
    CmarcaComponent,
    RecuperarCComponent,
    NuevaCComponent,
    PersonalComponent,
    PersonalFotoComponent,
    ListaComponent,
    NuevoComponent,
    CategoriaComponent,
    TipoComponent,
    FiltroPipe,
    FiltroTipoPipe,
    EditarComponent,
    PaginadorListaComponent,    
    NuevoIngresoComponent,
    ListaIngresoComponent,    
    SeleccionProductoComponent,
    VermasProductoComponent,
    EditarIngresoComponent,
    OfertaClienteComponent,
    OfertaProveedorComponent,
    PendientePaginadorComponent,
    AceptadoPaginadorComponent,
    RechazadoPaginadorComponent,
    CliPaginadorComponent,
    CliVerComponent,
    ProveedorListaComponent,
    ProveedorPaginadorComponent,
    ListaVendidosComponent,
    ListaPedidosComponent,
    ListaAnuladosComponent,
    BusquedaVentasComponent,    
    PaginadorGeneralComponent,
    ListaGeneralComponent,
    VerDireccionEnvioComponent,
    ListaReclamosComponent,
    PaginadorReclamosComponent,
    CdeliveryComponent,
    ListaLibroReclamosComponent,
    ListaLibroPaginadorComponent,
    DestinatariosComponent,
    DestinatariosPaginadorComponent,
    ListaSujerenciaComponent,
    PaginadorSujerenciaComponent,
    InicioComponent,
    HoraEntregaComponent,
    ModalDetallePagoComponent,
    VerImagenesComponent,
    PvariedadPipe,
    ListaPendientesPorProductoComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbPaginationModule
  ],
  providers: [
    {provide : HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
