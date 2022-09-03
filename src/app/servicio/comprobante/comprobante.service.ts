import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MResumenVenta } from 'src/app/modelo/comprobante/m-resumen-venta';
import { environment } from 'src/environments/environment';
import { Comprobante } from '../../modelo/comprobante/comprobante';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {

  cbPaginator: EventEmitter<number> = new EventEmitter();

  private url: string = environment.urlBackend + "/comprobante/cbte";

  constructor(private http: HttpClient) { }

  //listar para huacho
  public listarPedidosHuacho(page: number): Observable<any> {
    return this.http.get(this.url + "/huacho/pe/" + page).pipe(
      map((resp: any) => {
        resp.content as Comprobante[];
        return resp;
      })
    );
  }

  public listarEntregadosHuacho(page: number): Observable<any> {
    return this.http.get(this.url + "/huacho/en/" + page).pipe(
      map((resp: any) => {
        resp.content as Comprobante[];
        return resp;
      })
    );
  }

  public listarAnuladosHuacho(page: number): Observable<any> {
    return this.http.get(this.url + "/huacho/an/" + page).pipe(
      map((resp: any) => {
        resp.content as Comprobante[];
        return resp;
      })
    );
  }

  //listar para barranca
  public listarPedidosBarranca(page: number): Observable<any> {
    return this.http.get(this.url + "/barranca/pe/" + page).pipe(
      map((resp: any) => {
        resp.content as Comprobante[];
        return resp;
      })
    );
  }

  public listarEntregadosBarranca(page: number): Observable<any> {
    return this.http.get(this.url + "/barranca/en/" + page).pipe(
      map((resp: any) => {
        resp.content as Comprobante[];
        return resp;
      })
    );
  }

  public listarAnuladosBarranca(page: number): Observable<any> {
    return this.http.get(this.url + "/barranca/an/" + page).pipe(
      map((resp: any) => {
        resp.content as Comprobante[];
        return resp;
      })
    );
  }

  //Pedidos por validar
  public listarPedidosValidarBarranca(page: number): Observable<any> {
    return this.http.get(this.url + "/por/validar/barranca" + page).pipe(
      map((resp: any) => {
        resp.content as Comprobante[];
        return resp;
      })
    );
  }

  public listarPedidosValidarHuacho(page: number): Observable<any> {
    return this.http.get(this.url + "/por/validar/huacho/" + page).pipe(
      map((resp: any) => {
        resp.content as Comprobante[];
        return resp;
      })
    );
  }

  public buscarPedidosPorFechaValidar(fecha: string, sucursal:string): Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(this.url + "/validar/by/" + fecha + "/" + sucursal);
  }

  //busquedas
  public buscarComsPorNumero(numero: string): Observable<Comprobante[]> {
    return this.http.get(this.url + "/buscar/" + numero).pipe(
      map((resp: any) => {
        resp as Comprobante;
        const coms: Comprobante[] = [];
        coms.push(resp);
        return coms;
      })
    );
  }

  public buscarComsPorDocOrNombre(texto: string): Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(this.url + "/cli/dato/" + texto);
  }

  public buscarPedidosPorFecha(fecha: string, sucursal:string): Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(this.url + "/fp/" + fecha + "/" + sucursal);
  }  

  public buscarEntregadosPorFecha(fecha: string, sucursal:string): Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(this.url + "/fe/" + fecha + "/" + sucursal);
  }

  //edicion
  public editarComprobante(com: Comprobante): Observable<any> {
    return this.http.post(this.url + "/editar", com);
  }

  //anular
  public anularComprobante(com: Comprobante): Observable<any> {
    return this.http.post(this.url + "/anular", com);
  }

  //resumen de pedidos por producto
  public resumenes(sucursal: string): Observable<MResumenVenta[]> {
    return this.http.get(this.url + "/resumen/venta/" + sucursal).pipe(
      map(resp => {
        const res = resp as MResumenVenta[];
        res.sort((a, b) => {
          if (new Date(a.fechaEntrega) > new Date(b.fechaEntrega)) {
            return 1;
          }

          if (new Date(a.fechaEntrega) < new Date(b.fechaEntrega)) {
            return -1;
          }

          return 0
        });

        return res;
      })
    );
  }

  public resumenesPorFecha(fecha: string, sucursal:string): Observable<MResumenVenta[]> {
    return this.http.get<MResumenVenta[]>(this.url + "/resumen/venta/by/" + fecha + "/" + sucursal);
  }

}
