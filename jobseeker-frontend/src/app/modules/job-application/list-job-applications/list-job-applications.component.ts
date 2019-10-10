import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { JobApplicationService } from '../job-application.service';
import { backend_url } from './../../../app.component';


export interface JobApplicationElement {
  description: string;
  company: string;
  position: string;
  location: string;
  application_date: number;
  response_date: number;
  contact: string;
  status: string;
}

@Component({
  selector: 'app-list-application-dates',
  templateUrl: './list-job-applications.component.html',
  styleUrls: ['./list-job-applications.component.css']
})
export class ListJobApplicationsComponent implements OnInit {

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['description', 'application_date', 'location', 'status', 'contact', 'response_date', 'options'];
  dataSource: MatTableDataSource<JobApplicationElement>;
  Countries: any;
  constructor(
    public dialog: MatDialog,
    public jobApplicationService: JobApplicationService,
    private alertService: AlertService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.jobApplicationService.subject$.subscribe(data => {
      this.list();
    })
  }

  list() {
    this.jobApplicationService.list().subscribe(data => {
      this.dataSource = this.jobApplicationService.transformTimestampsToDate(data.data);
    })
  }

  openEditJobApplicationDialog(id): void {
    const dialogRef = this.dialog.open(EditJobApplicationDialog, {
      width: '60vw',
      data: { id: id }
    });
  }

  getReport() {
    this.jobApplicationService.getReport(this.dataSource).subscribe(data => {
      const reportURL = backend_url + data.data.reportRoute;
      window.open(reportURL, '_blank');
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  deleteJobApplication(id:string){
    this.jobApplicationService.delete(id).subscribe(data => {
      this.refresh();
      this.alertService.success('Job ApplicationDeleted');
      this.updateListView(id);
    }, err => {
      this.alertService.danger('Error: ' + err.error.message);
    })
  }

  updateListView(id:string){
    this.dataSource.filter = id.trim().toLowerCase();
  }

  refresh(){
    this.jobApplicationService.list().subscribe( (data)=>{
      this.dataSource = data.data;
      this.changeDetectorRefs.detectChanges();
    }
    )
  }
  ngOnInit() {
    this.refresh();
    this.list();
  }
}

@Component({
  selector: 'edit-job-application-dialog',
  templateUrl: 'edit-job-application-dialog.html',
})
export class EditJobApplicationDialog implements OnInit {

  jobApplicationForm: FormGroup;
  Countries: any;
  StatusOptions:any;
  Cities:any;

  constructor(
    public dialogRef: MatDialogRef<EditJobApplicationDialog>,
    private jobApplicationService: JobApplicationService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.jobApplicationForm = new FormGroup({
      description: new FormControl(''),
      company: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      application_date: new FormControl('', [Validators.required]),
      response_date: new FormControl(''),
      contact: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    })
  }
  // Date.parse(data.data.application_date)/1000
  ngOnInit() {
    this.jobApplicationService.getDetail(this.data.id).subscribe(data => {
      this.jobApplicationForm.get('description').setValue(data.data.description);
      this.jobApplicationForm.get('company').setValue(data.data.company);
      this.jobApplicationForm.get('position').setValue(data.data.position);
      this.jobApplicationForm.get('location').setValue(data.data.location);
      this.jobApplicationForm.get('application_date').setValue(data.data.application_date)
      this.jobApplicationForm.get('response_date').setValue(data.data.response_date);
      this.jobApplicationForm.get('contact').setValue(data.data.contact);
      this.jobApplicationForm.get('status').setValue(data.data.status);
    });
    this.getCountries();
    this.getStatusOptions();
  }
  getCountries() {
    this.jobApplicationService.listCountries().subscribe(data => {
      this.Countries = data.data;
    })
  }
  setCities(country){
    this.Cities = country.cities;
  }
  getStatusOptions(){
    this.jobApplicationService.getStatusOptions().subscribe(data=> {
      this.StatusOptions = data.data;
    })
  }

  edit() {
    this.jobApplicationService.update(this.data.id, this.jobApplicationForm.value).subscribe(data => {
      this.jobApplicationForm.controls['application_date'].setValue(
        Date.parse(this.jobApplicationForm.value.application_date)/1000
      );
      this.jobApplicationForm.controls['response_date'].setValue(
        (typeof this.jobApplicationForm.value.application_date === 'string')
        ? Date.parse(this.jobApplicationForm.value.response_date)/1000 : null
      );
      this.alertService.success('Job Application Updated');
      this.jobApplicationForm.reset();
      this.jobApplicationService.detectChanges(this.jobApplicationForm.value)
    }, err => {
      this.alertService.danger('Error: ' + err.error.message);
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}