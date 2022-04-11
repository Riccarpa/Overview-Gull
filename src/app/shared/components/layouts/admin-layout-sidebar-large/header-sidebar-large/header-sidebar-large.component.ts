import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../../services/navigation.service';
import { SearchService } from '../../../../services/search.service';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { ProjectService } from 'src/app/services/project/project.service';
import { ReqInterceptInterceptor } from 'src/app/services/interceptors/req-intercept.interceptor';


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
    private route: Router,
    private userService: UserService,
    private projectService: ProjectService,
    private interc: ReqInterceptInterceptor
  ) {

    
    const user = this.interc.takeRole()
  
    
    if (user) {

      this.userService.retrieveUser(user.id).subscribe(

        (res) => {

          this.currentUser = res.data
          if (this.currentUser.picture && this.currentUser.picture.includes('.png')) {
            this.currentUser.picture = `${environment.apiURL2}/images/users/${this.currentUser.id}.png?r=${this.projectService.randomNumber()}`
          } else {
            this.currentUser.picture = `${environment.apiURL2}/images/users/${this.currentUser.id}.jpg?r=${this.projectService.randomNumber()}`
          }
          this.role = user.role
        }
      )


        this.user = user
    }

  }

  currentUser: any
  role: number
  user:any
  ngOnInit() {
    
  }

  toggelSidebar() {
    const state = this.navService.sidebarState;


    if (state.sidenavOpen) {
      return state.sidenavOpen = false;
    } else {
      return state.sidenavOpen = true;
    }

  }

  signout() {
    localStorage.clear()
    this.route.navigate(['/'])

  }

}
