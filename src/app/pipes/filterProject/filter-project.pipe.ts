import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProject'
})
export class FilterProjectPipe implements PipeTransform {

  transform(arr: any, id: number) {

    if (id) {
      return arr.filter((p) =>

        p.client_id === id

      )
    }else{
      return arr
    }
    
  }

}
