import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {



  transform(allUsers: User[], idUser: number) {
    
   
    return allUsers.filter((us) =>

      us.id === idUser

    )
    
  }

}
