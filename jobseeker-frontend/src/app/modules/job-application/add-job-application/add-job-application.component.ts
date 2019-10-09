import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { JobApplicationService } from '../job-application.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-job-application',
  templateUrl: './add-job-application.component.html',
  styleUrls: ['./add-job-application.component.css']
})
export class AddJobApplicationComponent implements OnInit {

  addJobApplicationForm: FormGroup;
  Countries: any;
  Cities:any;
  StatusOptions:string[];

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    public jobApplicationService: JobApplicationService,
    private httpClient: HttpClient
  ) { }

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
  saveJobApplication() {
    // Parse dates to timestamp
    this.addJobApplicationForm.controls['application_date'].setValue(
      Date.parse(this.addJobApplicationForm.value.application_date)
    );
    this.addJobApplicationForm.controls['response_date'].setValue(
      (typeof this.addJobApplicationForm.value.application_date === 'string')
      ? Date.parse(this.addJobApplicationForm.value.response_date) : null
    );
    this.jobApplicationService.add(this.addJobApplicationForm.value).subscribe(data => {
      this.alertService.success('Job Application Added');
      this.addJobApplicationForm.reset();
    }, err => {
      this.alertService.danger('Error: ' + err.error.message);
    })
  }
  ngOnInit() {
    this.addJobApplicationForm = new FormGroup({
      description: new FormControl(''),
      company: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      application_date: new FormControl(new Date() , [Validators.required]),
      response_date: new FormControl(new Date()),
      contact: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      status:  new FormControl('')
    });
    this.getCountries();
    this.getStatusOptions();
  }

}
