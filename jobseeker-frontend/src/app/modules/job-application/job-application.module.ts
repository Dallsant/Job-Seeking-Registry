import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from './../../app-material/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertModule } from 'ngx-alerts';
import { MatPaginatorModule } from '@angular/material/paginator';

import { JobApplicationRoutingModule } from './job-application-routing.module';
import {AddJobApplicationComponent } from './add-job-application/add-job-application.component';
import { ListJobApplicationsComponent, EditJobApplicationDialog } from './list-job-applications/list-job-applications.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [AddJobApplicationComponent, ListJobApplicationsComponent, EditJobApplicationDialog],
  imports: [
    CommonModule,
    JobApplicationRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatDatepickerModule,
    AlertModule.forRoot({ maxMessages: 5, timeout: 5000, position: 'right' }),
  ],
  entryComponents: [
    EditJobApplicationDialog
  ]
})
export class JobApplicationModule { }
