import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from './shared/components/shared-components.module';
import { RoleDirective } from './directives/rolesDirective/role.directive';
import { ReqInterceptInterceptor } from './services/interceptors/req-intercept.interceptor';
import { ImageCropperComponent, ImageCropperModule } from 'ngx-img-cropper';
import { FilterClientPipe } from './pipes/associateClient/filter-client.pipe';
import { FilterProjectPipe } from './pipes/filterProject/filter-project.pipe';
import { FilterUsersPipe } from './pipes/associateUsers/filter-users.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { DragAndDropModule } from 'angular-draggable-droppable';

import { LoginComponent } from './components/login/login.component';
import { ClientComponent } from './components/client/client.component';
import { ProjectComponent } from './components/project/project.component';
import { UserComponent } from './components/user/user.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';
import { UpdateProjectComponent } from './components/project/update-project/update-project.component';
import { HomeUserComponent } from './components/user/homeUser/home-user/home-user.component';
import { SprintComponent } from './components/project/sprint/sprint.component';
import { TaskComponent } from './components/project/task/task.component';
import { FinancialComponent } from './components/financial/financial.component';
import { DayComponent } from './components/financial/calendar/day/day.component';
import { HistoryComponent } from './components/historys/history/history.component';
import { ShowFinancialComponent } from './components/financial/show-financial/show-financial.component';
import { IssueComponent } from './components/project/issues/issue/issue.component';
import { IssueDetailComponent } from './components/project/issues/issue-detail/issue-detail.component';
import { TrelloComponent } from './components/trello/trello.component';
import { TextareaAutoresizeDirective } from './directives/textarea-autoresize.directive';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientComponent,
    ProjectComponent,
    UserComponent,
    UpdateUserComponent,
    UpdateProjectComponent,
    FilterClientPipe,
    FilterUsersPipe,
    FilterProjectPipe,
    HomeUserComponent,
    RoleDirective,
    SprintComponent,
    TaskComponent,
    FinancialComponent,
    DayComponent,
    HistoryComponent,
    ShowFinancialComponent,
    IssueComponent,
    IssueDetailComponent,
    TrelloComponent,
    TextareaAutoresizeDirective
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedComponentsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    NgbModule,
    NgbTooltipModule,
    ImageCropperModule,
    CommonModule,
    NgSelectModule,
    TagInputModule,
    DragAndDropModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ReqInterceptInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
