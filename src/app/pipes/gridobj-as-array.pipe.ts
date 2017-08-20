import { Pipe, PipeTransform } from '@angular/core';
import { GridDay } from '../grid-day';

@Pipe({
  name: 'gridobjAsArray'
})
export class GridobjAsArrayPipe implements PipeTransform {

  /*
  * Transforms newgd object into an array for use with ngFor
  */

  transform(value: object, args?: any): Array<GridDay> {
    let gd: GridDay;
    let gds: Array<GridDay> = [];
    for (const key in value) {
      gd = value[key];
      gds.push(gd);
    }
    // console.log('pipe triggered');
    return gds;
  }

}


