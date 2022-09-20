import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Publicacion } from 'src/app/modelo/publicacion/publicacion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  private url:string = environment.urlBackend+"/publicacion/pu";

  constructor(private http:HttpClient) { }

  public listPublicacion() : Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.url+"/lista");
  }

  public createPublicacion(publiccion:Publicacion, imagen:File) : Observable<any> {
    return this.http.post(this.url+"/crear", publiccion).pipe(
      switchMap((resp:any) => {
        const formData = new FormData();
        formData.append("id", resp.id);
        formData.append("imagen", imagen);

        return this.http.post(`${this.url}/imagen`, formData).pipe(
          catchError(e => {
            this.deletePublicacion(resp.id).subscribe();
            return throwError(e);
          })
        );
      })
    );
  }

  public create_Publicacion(publiccion:Publicacion) : Observable<any> {
    return this.http.post(this.url+"/crear", publiccion).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public getPublicacion(id:number) : Observable<Publicacion> {
    return this.http.get<Publicacion>(this.url+"/obtener/"+id);
  }

  public updatePublicacion(publiccion:Publicacion, imagen:File) : Observable<any> {
    return this.http.post(this.url+"/editar", publiccion).pipe(
      switchMap((resp:any) => {
        const formData = new FormData();
        formData.append("id", publiccion.idpublicacion+"");
        formData.append("imagen", imagen);

        return this.http.post(`${this.url}/imagen`, formData).pipe(
          catchError(e => {            
            return throwError(e);
          })
        );
      })
    );
  }

  public update_Publicacion(publiccion:Publicacion) : Observable<any> {
    return this.http.post(this.url+"/editar", publiccion).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public deletePublicacion(id:number) : Observable<any> {
    return this.http.delete(this.url+"/eliminar/"+id);
  }

}
