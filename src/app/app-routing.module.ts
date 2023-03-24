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
import { FinancialComponent } from './components/financial/financial.component';
import { ShowFinancialComponent } from './components/financial/show-financial/show-financial.component';
import { IssueComponent } from './components/project/issues/issue/issue.component';
import { TrelloComponent } from './components/trello/trello.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home', component: AdminLayoutSidebarLargeComponent, children: [
      { path: 'client', component: ClientComponent },
      { path: 'user', component: UserComponent },
      { path: 'user/:id', component: UpdateUserComponent },
      { path: 'project', component: ProjectComponent },
      { path: 'updateProject/:id', component: UpdateProjectComponent },
      { path: 'homeUser/:id', component: HomeUserComponent },
      { path: 'financial/:id', component: FinancialComponent },
      { path: 'showFinancial/:id', component: ShowFinancialComponent },
      { path: 'trello/:id', component: TrelloComponent },
      // route to issue component 
      { path: 'issue', component: IssueComponent },
      
    ]
  },

  { path: 'login', component: LoginComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
