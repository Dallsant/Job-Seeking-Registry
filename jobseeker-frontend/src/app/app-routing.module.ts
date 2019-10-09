import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'job-applications',
    loadChildren: './modules/job-application/job-application.module#JobApplicationModule'
  },
  {
    path: 'session',
    loadChildren: './modules/session/session.module#SessionModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
