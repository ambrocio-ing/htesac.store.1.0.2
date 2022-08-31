import { Pipe, PipeTransform } from '@angular/core';
import { Categoria } from './categoria';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(categorias:Categoria[], page:number, search:string): Categoria[] {   

    if(search.length == 0){
      return categorias.slice(page, page + 5);
    }

    const filteredCategorias = categorias.filter( cat => cat.nombre.toLowerCase().includes(search.toLowerCase()));
    return filteredCategorias.slice(page, page + 5);
    
  }

}
