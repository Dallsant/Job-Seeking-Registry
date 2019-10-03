
import {
  repository,
  Where,
} from '@loopback/repository';
import { inject, Provider } from '@loopback/core';
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
import {User} from '../models/user.model'
import {SessionRepository, UserRepository} from '../repositories';

export class SessionServiceProvider implements Provider<any> {

  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(SessionRepository) public sessionRepository: SessionRepository,
  ) { }

  value(): any {
    return 'Login and Logout Service';
  }

  validatePassword(hashed_password:string, input_password:string){
    const password_verification = bcrypt.compareSync(input_password,hashed_password);
    return password_verification;
  }

  async getUserFromToken(token:string){
    const tokenInfo = await this.sessionRepository.findOne({where:{token:token}});
    // const username:any = tokenInfo.username;
    // const userInfo = this.userRepository.findOne({where:{username:username}});
  }
  createNewSession(user:User, request:any){
    try {
      const token = crypto.createHash('sha256').update(uuidv4()).digest("hex");
      const newSession:any = {
        user: user.id,
        ip: request.ip,
        token:token,
      }
      this.sessionRepository.create(newSession);
      return token;      
    } catch (error) {
      console.log(error);
    }
  }
    async endSession(token:string){
      try {
        let session:any = await this.sessionRepository.findOne({where:{token:token}});
        let endedSession:any = session;
        endedSession.is_active = false;
        endedSession.logout_date = Math.round((new Date().getTime() / 100 ) );
        this.sessionRepository.update(session, endedSession);        
      } catch (error) {
        console.log(error);
      }

  }

}

