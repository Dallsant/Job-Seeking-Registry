
import {
  repository,
  Where,
} from '@loopback/repository';
import { inject, Provider } from '@loopback/core';
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
import {User} from '../models/user.model'
import {Session} from '../models/session.model';
import {SessionRepository, UserRepository, JobApplicationRepository} from '../repositories';
import {SessionServiceProvider} from '../services/session.service'

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
  async getUserApplications(request:any){
    try {
      const token = request.header.authentication;
      const session:any = await this.sessionServiceProvider.getSessionInfo(token);
      // For some reason doesn't return anything??, to be fixed in the future
      // const jobApplications = await this.jobApplicationRepository.find({where:{user:session.user}});
      const jobApplications = await this.jobApplicationRepository.find();
      const filteredApplications = jobApplications.filter((item:any)=>{
        return item.user === session.user;
      });
      return filteredApplications;      
    } catch (error) {
      throw error;
    }
    }

      //Verify if the User making the request has access to that particular Application
    async checkUserAccessToApplication(request:any, id:any){
      try {
        const token = request.headers.authentication;
        const session:any = await this.sessionServiceProvider.getSessionInfo(token);
        const jobApplication:any = await this.jobApplicationRepository.findOne({where:{id:id}});
        if(jobApplication.user === session.user){
          return jobApplication;
        }else{
          throw 'Access Denied';
        }      
      } catch (error) {
        throw error;
      }   
  }
}
