import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './components/client/client.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectComponent } from './components/project/project.component';
import { UpdateProjectComponent } from './components/project/update-project/update-project.component';
import { UserComponent } from './components/user/user.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { HomeUserComponent } from './components/user/homeUser/home-user/home-user.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home',component:AdminLayoutSidebarLargeComponent,children:[
    { path: 'client', component: ClientComponent },
    { path: 'user', component: UserComponent },
    { path: 'user/:id', component: UpdateUserComponent },
    { path: 'project', component: ProjectComponent },
    { path: 'updateProject/:id', component: UpdateProjectComponent },
    { path: 'homeUser/:id', component: HomeUserComponent },

  ] },
  
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
