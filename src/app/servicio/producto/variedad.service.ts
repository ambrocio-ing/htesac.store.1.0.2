import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Variedad } from 'src/app/modelo/producto/variedad';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VariedadService {

  private url:string = environment.urlBackend + "/variedad/va";

  constructor(private http:HttpClient) { }

  public listVariedades(): Observable<Variedad[]>{
    return this.http.get<Variedad[]>(this.url + "/lista");
  }

  public createVariedad(va:Variedad): Observable<any>{
    return this.http.post(this.url + "/crear", va);
  }

  public getVariedad(id:number): Observable<Variedad>{
    return this.http.get<Variedad>(this.url + "/obtener/" + id);
  }

  public updateVariedad(va:Variedad): Observable<any>{
    return this.http.post(this.url + "/editar", va);
  }

  public deleteVariedad(id:number): Observable<any>{
    return this.http.delete(this.url + "/eliminar/" + id);
  }

}
