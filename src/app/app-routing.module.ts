import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CdeliveryComponent } from './cdelivery/cdelivery.component';
import { ClientesComponent } from './clientes/clientes.component';
import { EditarIngresoComponent } from './compra-venta/ingreso/editar-ingreso/editar-ingreso.component';
import { ListaIngresoComponent } from './compra-venta/ingreso/lista-ingreso/lista-ingreso.component';
import { NuevoIngresoComponent } from './compra-venta/ingreso/nuevo-ingreso/nuevo-ingreso.component';
import { ListaSujerenciaComponent } from './compra-venta/oferta/lista-sujerencia/lista-sujerencia.component';
import { OfertaClienteComponent } from './compra-venta/oferta/oferta-cliente/oferta-cliente.component';
import { OfertaProveedorComponent } from './compra-venta/oferta/oferta-proveedor/oferta-proveedor.component';
import { BusquedaVentasComponent } from './compra-venta/venta/busqueda-ventas/busqueda-ventas.component';
import { ListaAnuladosComponent } from './compra-venta/venta/lista-anulados/lista-anulados.component';
import { ListaPedidosComponent } from './compra-venta/venta/lista-pedidos/lista-pedidos.component';
import { ListaVendidosComponent } from './compra-venta/venta/lista-vendidos/lista-vendidos.component';
import { GmembresiaComponent } from './gmembresia/gmembresia.component';
import { GpublicidadComponent } from './gpublicidad/gpublicidad.component';
import { HoraEntregaComponent } from './hora-entrega/hora-entrega.component';
import { InicioComponent } from './inicio/inicio.component';
import { DestinatariosComponent } from './lista-destinatarios/destinatarios/destinatarios.component';
import { ListaLibroReclamosComponent } from './lista-libro-reclamos/lista-libro-reclamos.component';
import { LoginComponent } from './login/login.component';
import { NuevaCComponent } from './nueva-c/nueva-c.component';
import { PersonalComponent } from './personal/personal.component';
import { CategoriaComponent } from './producto-componente/categoria/categoria.component';
import { EditarComponent } from './producto-componente/editar/editar.component';
import { ListaComponent } from './producto-componente/lista/lista.component';
import { NuevoComponent } from './producto-componente/nuevo/nuevo.component';
import { TipoComponent } from './producto-componente/tipo/tipo.component';
import { ProveedorListaComponent } from './proveedor/proveedor-lista/proveedor-lista.component';
import { ListaReclamosComponent } from './reclamos/lista-reclamos/lista-reclamos.component';
import { RecuperarCComponent } from './recuperar-c/recuperar-c.component';
import { RoleGuard } from './servicio/guards/role.guard';

const routes: Routes = [
  { path: '',component:LoginComponent }, 
  { path: 'inicio', component: InicioComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },

  { path: 'cli-lista', component: ClientesComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'per', component: PersonalComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] } },
  { path: 'provee-lista', component: ProveedorListaComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },

  { path: 'pro-lista', component: ListaComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'pro-nuevo', component: NuevoComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] } },
  { path: 'pro-edit/:id', component: EditarComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] } },
  { path: 'cate', component: CategoriaComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'tipo', component: TipoComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },

  { path: 'desti', component: DestinatariosComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'suje', component: ListaSujerenciaComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },

  { path: 'ingre-nuevo', component: NuevoIngresoComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] } },
  { path: 'ingre-lista', component: ListaIngresoComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'ingre-edit/:id', component: EditarIngresoComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] } },

  { path: 'oferta-cli', component: OfertaClienteComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'oferta-pro', component: OfertaProveedorComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },

  { path: 'membresia', component: GmembresiaComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'publicidad', component: GpublicidadComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'reclamos', component: ListaReclamosComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'delivery', component: CdeliveryComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'libro-re', component: ListaLibroReclamosComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },

  { path: 'venta-busqueda', component: BusquedaVentasComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'venta-anulado', component: ListaAnuladosComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'venta-pedido', component: ListaPedidosComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'venta-entregado', component: ListaVendidosComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } },
  { path: 'hora-en', component: HoraEntregaComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] } },

  { path: 'new-pass', component: RecuperarCComponent },
  { path: 'change-password-admin/:token', component: NuevaCComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
