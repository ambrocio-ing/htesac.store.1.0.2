import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Delivery } from 'src/app/modelo/delivery/delivery';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private url:string = environment.urlBackend+"/deli/de";

  constructor(private http:HttpClient) { }

  public listDeliverys() : Observable<Delivery[]> {
    return this.http.get<Delivery[]>(this.url+"/lista");
  }

  public createDelivery(del:Delivery) : Observable<any> {
    return this.http.post(this.url+"/crear", del);
  }

  public getDelivery(id:number) : Observable<Delivery> {
    return this.http.get<Delivery>(this.url+"/obtener/"+id);
  }

  public updateDelivery(del:Delivery) : Observable<any> {
    return this.http.post(this.url+"/editar", del);
  }

  public deleteDelivery(id:number) : Observable<any> {
    return this.http.delete(this.url+"/eliminar/"+id);
  }

}
