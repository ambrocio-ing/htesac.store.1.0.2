import { Pipe, PipeTransform } from '@angular/core';
import { Tipo } from './tipo';

@Pipe({
  name: 'filtroTipo'
})
export class FiltroTipoPipe implements PipeTransform {

  transform(tipos:Tipo[], page:number,search:string): Tipo[] {

    if(search.length == 0){      
      return tipos.slice(page, page + 5);
    }

    const filteredTipos = tipos.filter(tipo => tipo.nombre.toLowerCase().includes(search.toLowerCase()));    
    return filteredTipos.slice(page, page + 5);
    
  }

}
