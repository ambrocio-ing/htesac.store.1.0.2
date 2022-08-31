import { Pipe, PipeTransform } from '@angular/core';
import { Color } from './color';

@Pipe({
  name: 'pvariedad'
})
export class PvariedadPipe implements PipeTransform {

  transform(colores:Color[]): string {
    
    let texto_co:string = "";    

    colores.forEach(co => {
      texto_co += co.nombreColor + ":" + co.cantidadColor + ", ";
    });   
    
    return texto_co;;
  }

}
