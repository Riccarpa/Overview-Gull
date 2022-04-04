import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReqInterceptInterceptor } from 'src/app/services/interceptors/req-intercept.interceptor';

export interface IMenuItem {
    id?: string;
    title?: string;
    description?: string;
    type: string;       // Possible values: link/dropDown/extLink
    name?: string;      // Used as display text for item and title for separator type
    state?: string;     // Router state
    icon?: string;      // Material icon name
    tooltip?: string;   // Tooltip text
    disabled?: boolean; // If true, item will not be appeared in sidenav.
    sub?: IChildItem[]; // Dropdown items
    badges?: IBadge[];
    active?: boolean;
}
export interface IChildItem {
    id?: string;
    parentId?: string;
    type?: string;
    name: string;       // Display text
    state?: string;     // Router state
    icon?: string;
    sub?: IChildItem[];
    active?: boolean;
}

interface IBadge {
    color: string;      // primary/accent/warn/hex color codes(#fff000)
    value: string;      // Display text
}

interface ISidebarState {
    sidenavOpen?: boolean;
    childnavOpen?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    public sidebarState: ISidebarState = {
        sidenavOpen: true,
        childnavOpen: false
    };
    selectedItem: IMenuItem;
    
    constructor(private interc:ReqInterceptInterceptor) {
       
        
     
    }

    user:number
    menu: IMenuItem[] = []
    menuItems = new BehaviorSubject<IMenuItem[]>(this.menu);
    menuItems$ = this.menuItems.asObservable();

    defaultMenu: IMenuItem[] = [
        
        {
            name: 'Users',
            type: 'link',
            state:'user',
            icon: 'i-Boy',
            
        },
        {
            name: 'Projects',
            type: 'link',
            state:'project',
            icon: 'i-Bar-Chart',
            
        },
        {
            name: 'Clients',
            type: 'link',
            state:'client',
            icon: 'i-Business-Mens',
            
        },
        
    ];

    userMenu:  IMenuItem[] =[

        {
            name: 'User',
            type: 'link',
            state: 'user',
            icon: 'i-Boy',

        },
        {
            name: 'Projects',
            type: 'link',
            state: 'project',
            icon: 'i-Bar-Chart',

        }, 
    ];

    pmMenu: IMenuItem[] =[
        {
            name: 'User',
            type: 'link',
            state: 'user',
            icon: 'i-Boy',

        },

        {
            name: 'Projects',
            type: 'link',
            state: 'project',
            icon: 'i-Bar-Chart',

        },
    ];
   
    // You can customize this method to supply different menu for
    // different user type.
    // publishNavigationChange(role: number) {
    //   switch (role) {
    //     case 2:
    //         return this.pmMenu
    //     case 0:
    //         return this.userMenu
       
    //     default:
    //         return  this.defaultMenu
    //   }


    // }


    publishNavigationChange(role: number) {
      switch (role) {
        case 2:
          this.menuItems.next(this.pmMenu);
          break;
        case 0:
          this.menuItems.next(this.userMenu);
          break;
        default:
          this.menuItems.next(this.defaultMenu);
      }
    }
}
