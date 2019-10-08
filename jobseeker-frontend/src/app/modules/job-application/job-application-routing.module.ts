import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddJobApplicationComponent } from './add-job-application/add-job-application.component';
import { ListJobApplicationsComponent } from './list-job-applications/list-job-applications.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddJobApplicationComponent
  },
  {
    path: 'list',
    component: ListJobApplicationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobApplicationRoutingModule { }
