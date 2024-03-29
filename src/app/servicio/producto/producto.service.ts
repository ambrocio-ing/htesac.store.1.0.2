import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Producto } from 'src/app/modelo/producto/producto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url: string = environment.urlBackend + "/producto/pto"
  public cbPaginar: EventEmitter<number> = new EventEmitter();
  public cbProducto: EventEmitter<Producto> = new EventEmitter();

  constructor(private http: HttpClient) { }

  public listProductos(page: number): Observable<any> {
    return this.http.get(this.url + "/lista/" + page).pipe(
      map((resp: any) => {
        resp.content as Producto[];
        return resp;
      })
    );
  }

  public listProductosModal(page: number): Observable<any> {
    return this.http.get(this.url + "/modal/lista/" + page).pipe(
      map((resp: any) => {
        resp.content as Producto[];
        return resp;
      })
    );
  }

  public searchProductos(texto: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url + "/buscar/" + texto);
  }

  public createProducto(producto: Producto): Observable<any> {
    return this.http.post(this.url + "/crear", producto).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public createProductoWithImage(producto: Producto, imagenes: File[]): Observable<any> {
    return this.http.post(this.url + "/crear", producto).pipe(
      switchMap((resp: any) => {

        const formData = new FormData();
        formData.append("id", resp.id);
        imagenes.forEach(img => formData.append("imagenes", img));
        //formData.append("imagenes", imagenes[0]);
  
        return this.http.post(`${this.url}/imgs`, formData).pipe(
          catchError(e => {
            this.deleteProducto(resp.id).subscribe();
            return throwError(e);
          })
        );
      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(this.url + "/obtener/" + id).pipe(

      catchError(e => {
        return throwError(e);
      })
    );
  }

  public update_Producto(producto: Producto): Observable<any> {
    return this.http.post(this.url + "/editar", producto);
  }

  public updateProducto(producto: Producto, imagenes: File[]): Observable<any> {
    return this.http.post(this.url + "/editar", producto).pipe(
      switchMap((resp: any) => {

        const formData = new FormData();
        formData.append("id", resp.id);        
        imagenes.forEach(img => formData.append("imagenes", img));        
        return this.http.post(`${this.url}/imgs`, formData).pipe(
          catchError(e => {            
            return throwError(e);
          })
        );

      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }  

  public deleteProducto(id: number): Observable<any> {
    return this.http.delete(this.url + "/eliminar/" + id).pipe(
      map(resp => resp)
    );
  }

  public deleteImg(idimagen:number): Observable<any> {
    return this.http.delete(this.url + "/img/eliminar/" + idimagen);
  }

}
