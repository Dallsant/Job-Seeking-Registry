
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
  async setWorksheetColumns(worksheet:any, alignment:object, headerStyle:object) {
    try {
      let columns = [
        { header: 'Application Date', key: 'application ', width: 25, position: 'center' },
        { header: 'Company', key: 'company ', width: 25, position: 'center' },
        { header: 'Location', key: 'Location', width: 25, position: 'center' },
        { header: 'Application Date', key: 'application_date', width: 25, position: 'center' },
        { header: 'Status', key: 'status', width: 25, position: 'center' },
        { header: 'Position', key: 'position', width: 25, position: 'center' },
        { header: 'Response Date', key: 'response_date', width: 25, position: 'center' },
        { header: 'Contact', key: 'contact', width: 25, position: 'center' },
      ];
      columns.forEach(element => {
        worksheet.getCell(`${element.key}`).font = headerStyle;
        worksheet.getCell(`${element.key}`).alignment = alignment; 
      });
    } catch (error) {
      throw error;
    }
  }

  setWorksheetData(worksheet: any, jobApplications: any, headerStyle:object, alignment: object) {
  
  
  }

  transformTimestampToDate(timestamp: number) {
    const date = moment.unix(timestamp);
    const formattedDate = date.format('DD/MM/YYYY HH:mm:ss');
    return formattedDate;
  }

}
