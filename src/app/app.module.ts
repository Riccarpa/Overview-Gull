import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { ClientComponent } from './components/client/client.component';
import { ProjectComponent } from './components/project/project.component';
import { UserComponent } from './components/user/user.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateProjectComponent } from './components/project/update-project/update-project.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from './shared/components/shared-components.module';
import { ImageCropperComponent, ImageCropperModule} from 'ngx-img-cropper';
import { FilterClientPipe } from './pipes/associateClient/filter-client.pipe';
import { FilterUsersPipe } from './pipes/associateUsers/filter-users.pipe';





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
    ImageCropperModule
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
