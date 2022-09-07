import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DetalleMembresia } from 'src/app/modelo/membresia/detalle-membresia';
import { Membresia } from 'src/app/modelo/membresia/membresia';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {

  private url: string = environment.urlBackend + "/membresia/mem";
  private url_det: string = environment.urlBackend + "/detalle-mem/dm";

  constructor(private http: HttpClient) { }

  public listMembresia(): Observable<Membresia[]> {
    return this.http.get<Membresia[]>(this.url + "/lista");
  }

  public createMembresia(mem: Membresia, imagen: File): Observable<any> {
    return this.http.post(this.url + "/crear", mem).pipe(
      switchMap((res: any) => {

        const formData = new FormData();
        formData.append("id", res.id);
        formData.append("imagen", imagen);

        return this.http.post(`${this.url}/imagen`, formData).pipe(
          catchError(e => {  
            this.deleteMembresia(res.id).subscribe();      
            return throwError(e);
          })
        );

      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public create_Membresia(mem: Membresia): Observable<any> {
    return this.http.post(this.url + "/crear", mem).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public getMembresia(id: number): Observable<Membresia> {
    return this.http.get<Membresia>(this.url + "/obtener/" + id);
  }

  public updateMembresia(mem: Membresia, imagen: File): Observable<any> {
    return this.http.post(this.url + "/editar", mem).pipe(
      switchMap((res: any) => {

        const formData = new FormData();
        formData.append("id", mem.idmembresia.toString());
        formData.append("imagen", imagen);

        return this.http.post(`${this.url}/imagen`, formData);

      }),
      catchError(e => {        
        return throwError(e);
      })
    );
  }

  public deleteMembresia(id: number): Observable<any> {
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  public update_Membresia(mem: Membresia): Observable<any> {
    return this.http.post(this.url + "/editar", mem).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  //metodo para detalle de membresia
  public listDetMembresiaPorCliente(texto:string): Observable<DetalleMembresia[]> {
    return this.http.get<DetalleMembresia[]>(this.url_det + "/buscar/porcli/" + texto);
  }

  public listDetMembresiaPorEstado(estado:string): Observable<DetalleMembresia[]> {
    return this.http.get<DetalleMembresia[]>(this.url_det + "/by/" + estado);
  }

  public updateDetMembresia(detmem: DetalleMembresia): Observable<any> {
    return this.http.post(this.url_det + "/editar", detmem);
  }

}
