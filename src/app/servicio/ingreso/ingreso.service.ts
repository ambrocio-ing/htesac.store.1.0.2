import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DetalleIngreso } from 'src/app/modelo/detalle-ingreso/detalleingreso';
import { Ingreso } from 'src/app/modelo/ingreso/ingreso';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {  

  public cbIngreso:EventEmitter<number> = new EventEmitter();
  private url = environment.urlBackend+"/ingreso/in";

  constructor(private http:HttpClient) { }

  public searchDIByProducto(texto:string) : Observable<DetalleIngreso[]> {
    return this.http.get<DetalleIngreso[]>(this.url+"/di/por/producto/"+texto);
  }

  searchDIByCategoria(texto: string): Observable<DetalleIngreso[]>{
    return this.http.get<DetalleIngreso[]>(this.url+"/di/por/categoria/"+texto);
  }

  public getDIByIdproducto(idp:number) : Observable<DetalleIngreso> {
    return this.http.get<DetalleIngreso>(this.url+"/di/por/idp/"+idp);
  }

  public listDI(page:number) : Observable<any>{
    return this.http.get(this.url+"/di/lista/"+page).pipe(
      map((resp : any) => {
        resp.content as DetalleIngreso[];
        return resp;
      })
    );
  }

  public listByFecha(fecha:string) : Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(this.url+"/buscar/"+fecha);
  }

  public createIngreso(ingreso:Ingreso) : Observable<any> {
    return this.http.post(this.url+"/crear", ingreso).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public getIngreso(id:number) :Observable<Ingreso> {
    return this.http.get<Ingreso>(this.url+"/obtener/"+id);
  }

  public updateIngreso(ingreso:Ingreso) : Observable<any> {
    return this.http.post(this.url+"/editar", ingreso).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public deleteIngreso(id:number) :Observable<any> {
    return this.http.delete(this.url+"/eliminar/"+id).pipe(
      catchError(e => {
        console.log("Error",e);
        return throwError(e);
      })
    );
  }

  public deleteDI(iddi:number) :Observable<any> {
    return this.http.delete(this.url+"/di/eliminar/"+iddi);
  }

}
