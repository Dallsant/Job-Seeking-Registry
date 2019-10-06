
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
import { SessionRepository, UserRepository } from '../repositories';

export class SessionServiceProvider implements Provider<any> {

  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(SessionRepository) public sessionRepository: SessionRepository,
  ) { }

  value(): any {
    return 'Session Handling Service';
  }

  validatePassword(hashed_password: string, input_password: string) {
    try {
      const password_verification = bcrypt.compareSync(input_password, hashed_password);
      return password_verification;
    } catch (error) {
      throw error;
    }
  }

  async getUserFromToken(token: any) {
    try {
      const tokenInfo: any = await this.sessionRepository.findOne({ where: { token: token } });
      const username: any = tokenInfo.username;
      return await this.userRepository.findOne({ where: { username: username } });
    } catch (error) {
      throw error;
    }
  }

  async getSessionInfo(token: any) {
    try {
      const session: any = await this.sessionRepository.findOne({ where: { token: token } });
      if (session !== null) {
        return session;
      }
    } catch (error) {
      throw error;
    }
  }

  createNewSession(user: User, request: any) {
    try {
      const token = crypto.createHash('sha256').update(uuidv4()).digest("hex");
      const newSession: any = {
        user: user.id,
        ip: request.ip,
        token: token,
      }
      this.sessionRepository.create(newSession);
      return token;
    } catch (error) {
      throw error;
    }
  }

  async endSession(token: string) {
    try {
      const session: any = await this.sessionRepository.findOne({ where: { token: token, 'is_active': true } });
      const endedSession: any = session;
      endedSession.is_active = false;
      endedSession.logout_date = Math.round((new Date().getTime() / 100));
      this.sessionRepository.update(session, endedSession);
    } catch (error) {
      throw error
    }
  }

  async terminateExpiredSessions() {
    try {
      const now = Math.round(new Date().getTime() / 100);
      const active_sessions: any = await this.sessionRepository.find({ where: { is_active: true } });
      const expiredSessions: any = active_sessions.filter((item: any) => {
        return (now - item.login_date >= global.session_timeout);
      });
      const sessionsToUpdate = expiredSessions.map((item: any) => {
        return item.token;
      })
      for (let session of expiredSessions) {
        session['is_active'] = false;
        session['logout_date'] = now;
        delete session['id'];
      }
      await this.sessionRepository.deleteAll({ token: { inq: sessionsToUpdate } });
      await this.sessionRepository.createAll(expiredSessions);
    } catch (error) {
      throw 'Error while terminating sessions';
    }
  }
  async checkTokenValidity(token: any) {
    try {
      const session: any = await this.sessionRepository.findOne({ where: { token: token } });
      if (session !== null && session.is_active === true) {
        return session;
      } else {
        throw 'Invalid Session';
      }
    } catch (error) {
      throw error;
    }
  }
}

