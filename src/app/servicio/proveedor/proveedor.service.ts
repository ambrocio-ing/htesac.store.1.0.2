import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Proveedor } from 'src/app/modelo/proveedor/proveedor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  public cbPaginar:EventEmitter<number> = new EventEmitter();

  private url:string = environment.urlBackend+"/admin/pro";

  constructor(private http:HttpClient) { }

  listProveedores(page:number) : Observable<any> {
    return this.http.get(this.url+"/lista/"+page).pipe(
      map((resp:any) => {
        resp.content as Proveedor[];
        return resp;
      })
    );
  } 

  searchProveedores(texto:string) : Observable<Proveedor[]> {
    return this.http.get(this.url+"/buscar/"+texto).pipe(
      map(resp => resp as Proveedor[])
    );
  }

  suspenderProveedor(proveedor:Proveedor) : Observable<any> {
    return this.http.post(this.url+"/sus", proveedor);
  }

}
