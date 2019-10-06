
import {
  repository,
  Where,
} from '@loopback/repository';
import { inject, Provider } from '@loopback/core';
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
import { User } from '../models/user.model'
import { Session } from '../models/session.model';
import { SessionRepository, UserRepository, JobApplicationRepository } from '../repositories';
import { SessionServiceProvider } from '../services/session.service'
import * as moment from 'moment';

export class ReportServiceProvider implements Provider<any> {

  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(SessionRepository) public sessionRepository: SessionRepository,
    @repository(JobApplicationRepository) public jobApplicationRepository: JobApplicationRepository,
    @inject('services.SessionServiceProvider')
    public sessionServiceProvider: SessionServiceProvider,
  ) { }

  value(): any {
    return 'Excel Report Service';
  }

  //Verify if the User making the request has access to that particular Application
  async setWorksheetColumns(worksheet:any, alignment:object, style:object, alphabet:any) {
    try {
      let columns = [
        { header: 'Application Date', key: 'application_date', width: 25, position: 'center' },
        { header: 'Company', key: 'company ', width: 25, position: 'center' },
        { header: 'Location', key: 'Location', width: 25, position: 'center' },
        { header: 'Status', key: 'status', width: 25, position: 'center' },
        { header: 'Position', key: 'position', width: 25, position: 'center' },
        { header: 'Response Date', key: 'response_date', width: 25, position: 'center' },
        { header: 'Contact', key: 'contact', width: 25, position: 'center' },
      ];
      for(let i=0; i<=8; i++){
        worksheet.getCell(`${alphabet[i]}1`).font = style;
        worksheet.getCell(`${alphabet[i]}1`).alignment = alignment;
      }
      worksheet.columns = columns;
    } catch (error) {
      throw error;
    }
  }
  
  setWorksheetData(worksheet: any, jobApps: any, 
    style:object) { 
    jobApps.forEach( (element:any, index:number) => {
      // Cell Data
      worksheet.getCell(`A${index+2}`).value = this.transformTimestampToDate(element.application_date);  
      worksheet.getCell(`B${index+2}`).value = element.company;
      worksheet.getCell(`C${index+2}`).value = element.location;
      worksheet.getCell(`D${index+2}`).value = element.status;
      worksheet.getCell(`E${index+2}`).value = element.position;
      worksheet.getCell(`F${index+2}`).value = (element.response_date!==null)?this.transformTimestampToDate(element.response_date):'None';
      worksheet.getCell(`G${index+2}`).value = element.contact;  
      
      // Cell style
      worksheet.getCell(`A${index+2}`).font = style;  
      worksheet.getCell(`B${index+2}`).font = style;
      worksheet.getCell(`C${index+2}`).font = style;
      worksheet.getCell(`D${index+2}`).font = style;
      worksheet.getCell(`E${index+2}`).font = style;
      worksheet.getCell(`F${index+2}`).font = style;
      worksheet.getCell(`G${index+2}`).font = style;  
    });  
  }

  transformTimestampToDate(timestamp: number) {
    const date = moment.unix(timestamp);
    const formattedDate = date.format('DD/MM/YYYY HH:mm:ss');
    return formattedDate;
  }

}
