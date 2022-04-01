import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../../services/navigation.service';
import { SearchService } from '../../../../services/search.service';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { ProjectService } from 'src/app/services/project/project.service';


@Component({
  selector: 'app-header-sidebar-large',
  templateUrl: './header-sidebar-large.component.html',
  styleUrls: ['./header-sidebar-large.component.scss']
})
export class HeaderSidebarLargeComponent implements OnInit {

    notifications: any[];

    constructor(
      private navService: NavigationService,
      public searchService: SearchService,
      private auth: AuthService,
      private route:Router,
      private userService:UserService,
      private projectService:ProjectService
    ) {
     
     
    }
  
    currentUser:any
    role:number
    ngOnInit() {

      // const user = JSON.parse(localStorage.getItem('user'))

      // setTimeout(() => {

      //   if (user) {

      //     this.userService.retrieveUser(user.id).subscribe(

      //       (res) => {

      //         this.currentUser = res
      //         if (this.currentUser.data.picture && this.currentUser.data.picture.includes('.png')) {
      //           this.currentUser.data.picture = `${environment.apiURL2}/images/users/${this.currentUser.data.id}.png?r=${this.projectService.randomNumber()}`
      //         } else {
      //           this.currentUser.data.picture = `${environment.apiURL2}/images/users/${this.currentUser.data.id}.jpg?r=${this.projectService.randomNumber()}`
      //         }
      //         this.role = user.role
      //         console.log(res, 'res nella sidebar');


      //       }
      //     )
      //   }
      // }, 1000);
      
    }
  
    toggelSidebar() {
      const state = this.navService.sidebarState;

      
      if ( state.sidenavOpen) {
        return state.sidenavOpen = false;
      }else{
        return state.sidenavOpen = true;
      }
      
    }
  
    signout() {
      localStorage.clear()
      this.route.navigate(['/'])

    }

}
