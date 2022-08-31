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

  cbPaginator:EventEmitter<number> = new EventEmitter();  

  private url:string = environment.urlBackend+"/comprobante/cbte";

  constructor(private http:HttpClient) { }

  public listarPedidos(page:number) : Observable<any> {
    return this.http.get(this.url+"/pe/"+page).pipe(
      map((resp:any) => {
        resp.content as Comprobante[];
        return resp;
      })
    );
  }

  public listarEntregados(page:number) : Observable<any> {
    return this.http.get(this.url+"/en/"+page).pipe(
      map((resp:any) => {
        resp.content as Comprobante[];
        return resp;
      })
    );
  }

  public listarAnulados(page:number) : Observable<any> {
    return this.http.get(this.url+"/an/"+page).pipe(
      map((resp:any) => {
        resp.content as Comprobante[];
        return resp;
      })
    );
  }

  //busquedas
  public buscarComsPorNumero(numero:string) : Observable<Comprobante[]> {
    return this.http.get(this.url+"/buscar/"+numero).pipe(
      map((resp:any) => {
        resp as Comprobante;
        const coms:Comprobante[] = [];
        coms.push(resp);
        return coms;
      })
    );
  }

  public buscarComsPorDocOrNombre(texto:string) : Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(this.url+"/cli/dato/"+texto);
  }

  public buscarPedidosPorFecha(fecha:string) : Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(this.url+"/fp/"+fecha);
  }

  public buscarEntregadosPorFecha(fecha:string) : Observable<Comprobante[]> {
    return this.http.get<Comprobante[]>(this.url+"/fe/"+fecha);
  }

  //edicion
  public editarComprobante(com:Comprobante) : Observable<any> {
    return this.http.post(this.url+"/editar", com);
  }

  //anular
  public anularComprobante(com:Comprobante) : Observable<any> {
    return this.http.post(this.url+"/anular", com);
  }

  //resumen de pedidos por producto
  public resumenes(): Observable<MResumenVenta[]>{
    return this.http.get(this.url + "/resumen/venta").pipe(
      map(resp => {
        const res = resp as MResumenVenta[];
        res.sort((a, b) => {
          if(new Date(a.fechaEntrega) > new Date(b.fechaEntrega)){
            return 1;
          }

          if(new Date(a.fechaEntrega) < new Date(b.fechaEntrega)){
            return -1;
          }
          
          return 0
        });

        return res;
      })
    );
  }

  public resumenesPorFecha(fecha:string): Observable<MResumenVenta[]>{
    return this.http.get<MResumenVenta[]>(this.url + "/resumen/venta/by/" + fecha);
  }

}
