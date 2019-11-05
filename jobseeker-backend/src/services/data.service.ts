
import {
  repository,
  Where,
} from '@loopback/repository';
import { inject, Provider } from '@loopback/core';

import { SessionRepository, UserRepository, JobApplicationRepository } from '../repositories';
import { SessionServiceProvider } from '../services/session.service'
import * as moment from 'moment';
import { timingSafeEqual } from 'crypto';

export class DataServiceProvider implements Provider<any> {

  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(SessionRepository) public sessionRepository: SessionRepository,
    @repository(JobApplicationRepository) public jobApplicationRepository: JobApplicationRepository,
    @inject('services.SessionServiceProvider')
    public sessionServiceProvider: SessionServiceProvider,
  ) { }

  value(): any {
    return 'Data Handling Service';
  }

  // ## Get all JobApplications based on the User making the request
  async getUserApplications(request: any) {
      const token = request.headers.authentication;
      const user: any = await this.sessionServiceProvider.getUserFromToken(token);
      // Not able to retrieve anything that resembles a mongo ID
      const sjobApps: any = await this.jobApplicationRepository.find({ where: { 'user': { 'inq': ["5da08e15a307b427981f5ab0"] } } });
      let jobApps: any = await this.jobApplicationRepository.find();
      jobApps = jobApps.filter((item: any) => {
        return item.user === user.id;
      });
      return jobApps;
  }

  //Verify if the User making the request has access to that particular Application
  async checkUserAccessToApplication(request: any, id: any) {
      const token = request.headers.authentication;
      const session: any = await this.sessionServiceProvider.getSessionInfo(token);
      const jobApplication: any = await this.jobApplicationRepository.findOne({ where: { id: id } });
      if (jobApplication.user === session.user) {
        return jobApplication;
      } else {
        throw 'Access Denied';
      }
  }

  getCurrentTime() {
    const now = Math.round((new Date().getTime() / 100));
    return now;
  }

  transformTimestampToDate(timestamp: number) {
    const date = moment.unix(timestamp);
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }

}
