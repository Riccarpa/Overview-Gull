import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './components/client/client.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectComponent } from './components/project/project.component';
import { UpdateProjectComponent } from './components/project/update-project/update-project.component';
import { UserComponent } from './components/user/user.component';
import { UpdateClientComponent } from './components/client/update-client/update-client.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'client', component: ClientComponent },
  { path: 'user', component: UserComponent },
  { path: 'user/:id', component: UpdateUserComponent },
  { path: 'project', component: ProjectComponent },
  { path: 'updateProject/:id', component: UpdateProjectComponent },
  { path: 'client/:id', component: UpdateClientComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
