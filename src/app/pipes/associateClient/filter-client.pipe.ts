import { Pipe, PipeTransform } from '@angular/core';
import { Client } from 'src/app/models/client.model';

@Pipe({
  name: 'filterClient'
})
export class FilterClientPipe implements PipeTransform {

  transform(allClient: Client[], projectClientId:number) {
    return allClient.filter(

      (client) => client.id === projectClientId
    )
  }

}
