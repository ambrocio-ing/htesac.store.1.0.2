import { Pipe, PipeTransform } from '@angular/core';
import { Color } from './color';
import { Variedad } from './variedad';

@Pipe({
  name: 'pvariedad'
})
export class PvariedadPipe implements PipeTransform {

  transform(variedades:Variedad[]): string {
    
    let texto:string = "";

    variedades.forEach(va => {
      let color_texto = "";
      va.colores.forEach(co => {
        color_texto += " => " + co.nombreColor + ":" + co.cantidadColor
      });

      texto += va.nombreTalla + ":" + va.cantidadTalla + color_texto + " | ";
    });

    return texto;
  }

}
