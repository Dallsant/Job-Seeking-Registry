
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
    try {
      console.log(request);
      const token = request.headers.authorization;
      console.log(token);
      const session: any = await this.sessionServiceProvider.getSessionInfo(token);
      // For some reason doesn't seem to work, to be fixed in the future
      // const jobApplications = await this.jobApplicationRepository.find({where:{user:session.user}});
      console.log(await this.sessionServiceProvider.getUserFromToken(token));
      const jobApplications = await this.jobApplicationRepository.find();
      const filteredApplications = jobApplications.filter((item: any) => {
        return item.user === session.user;
      });
      return filteredApplications;
    } catch (error) {
      throw error;
    }
  }

  //Verify if the User making the request has access to that particular Application
  async checkUserAccessToApplication(request: any, id: any) {
    try {
      const token = request.headers.authentication;
      const session: any = await this.sessionServiceProvider.getSessionInfo(token);
      const jobApplication: any = await this.jobApplicationRepository.findOne({ where: { id: id } });
      if (jobApplication.user === session.user) {
        return jobApplication;
      } else {
        throw 'Access Denied';
      }
    } catch (error) {
      throw error;
    }
  }

  getCurrentTime() {
    const now = Math.round((new Date().getTime() / 100));
    return now;
  }

  transformTimestampToDate(timestamp: number) {
    const date = moment.unix(timestamp);
    const formattedDate = date.format('DD/MM/YYYY');
    // const formattedDate = date.format('DD/MM/YYYY HH:mm:ss');
    return formattedDate;
  }

}
