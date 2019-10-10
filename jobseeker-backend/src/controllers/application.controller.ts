import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  Response,
  RestBindings,
  Request
} from '@loopback/rest';
import { JobApplication } from '../models';
import { SessionRepository, JobApplicationRepository } from '../repositories';
import { ResponseManager } from '../services/response-manager';
import { UserRepository } from '../repositories';
import { inject } from '@loopback/context';
import { SessionServiceProvider, DataServiceProvider, ReportServiceProvider } from '../services';
import { User } from '../models/index';
const Excel = require('exceljs');


export class ApplicationController {
  public responseObject: ResponseManager;
  constructor(
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @repository(JobApplicationRepository)
    public jobApplicationRepository: JobApplicationRepository,
    @inject('services.SessionServiceProvider')
    public sessionServiceProvider: SessionServiceProvider,
    @inject('services.DataServiceProvider')
    public dataServiceProvider: DataServiceProvider,
    @inject('services.ReportServiceProvider')
    public reportServiceProvider: ReportServiceProvider,
  ) {
    this.responseObject = new ResponseManager(this.response);
  }

  @post('/job-applications')
  async create(@requestBody() jobApplication: any): Promise<any> {
    const fields = {
      'description': 'string',
      'company': 'string',
      'position': 'string',
      'country': 'string',
      'city': 'string',
      'application_date': 'number',
      'contact': 'string',
    }
    try {
      this.responseObject.validateRequest(jobApplication, fields);
    } catch (error) {
      return this.responseObject.setResponse();
    }
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {
      const sessionInfo: any = await this.sessionServiceProvider.getSessionInfo(this.request.headers['authentication']);
      if (sessionInfo !== null) {
        jobApplication.location = `${jobApplication.city} - ${jobApplication.country}`;
        delete jobApplication.country;
        delete jobApplication.city;
        jobApplication.user = sessionInfo.user;
        await this.jobApplicationRepository.create(jobApplication);
        return this.responseObject.successResponse();
      }
    } catch (error) {
      return this.responseObject.defaultErrorResponse();
    }
  }
  @get('/job-applications/count')
  async count(
  ): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {
      const userApps = await this.dataServiceProvider.getUserApplications(this.request);
      const count = userApps.length;
      this.responseObject.data = count;
      return this.responseObject.successResponse();
    } catch (error) {
      return this.responseObject.customResponse(true, "There was an error while handling the request", 500);
    }
  }

  @get('/job-applications')
  async find(
    @param.query.object('filter', getFilterSchemaFor(JobApplication)) filter?: Filter<JobApplication>,
  ): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {
      const applications = await this.dataServiceProvider.getUserApplications(this.request);
      this.responseObject.data = applications;
      return this.responseObject.successResponse();
    } catch (error) {
      console.log(error);
      return this.responseObject.customResponse(true, "There was an error while handling the request", 500);
    }
  }

  @get('/job-applications/{id}')
  async findById(@param.path.string('id') id: string): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {
      const application = await this.dataServiceProvider.checkUserAccessToApplication(this.request, id);
      this.responseObject.data = application;
      return this.responseObject.successResponse()
    } catch (error) {
      console.log(error)
      return this.responseObject.customResponse(true, "There was an error while handling the request", 500);
    }
  }

  @patch('/job-applications/{id}')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody()
    jobApplication: JobApplication,
  ): Promise<any> {
    try {
      try {
        await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
      } catch (error) {
        return this.responseObject.customResponse(true, "Invalid Session", 401);
      }
      const fields = {
        'id': 'string',
        'description': 'string',
        'user': 'number',
        'company': 'string',
        'position': 'string',
        'location': 'number',
        'application_date': 'string',
        'contact': 'string',
        'status': 'string'
      }
      try {
        this.responseObject.validateRequest(JobApplication, fields);
      } catch (error) {
        return this.responseObject.setResponse();
      }
      const application = await this.dataServiceProvider.checkUserAccessToApplication(this.request, id);
      if (application.length) await this.jobApplicationRepository.updateById(id, jobApplication);
      return this.responseObject.successResponse();
    } catch (error) {
      return this.responseObject.customResponse(true, "There was an error while handling the request", 500);
    }
  }

  @del('/job-applications/{id}')
  async deleteById(@param.path.string('id') id: string): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {
      const application = await this.dataServiceProvider.checkUserAccessToApplication(this.request, id);
      this.jobApplicationRepository.deleteById(id);
      return this.responseObject.successResponse();
    } catch (error) {
      return this.responseObject.customResponse(true, "There was an error while processing the request", 500);
    }
  }

  @post('/report')
  async createReport(@requestBody() jobApplications: JobApplication[]): Promise<any> {
    let session: any = {};
    let user: any;
    const now = this.dataServiceProvider.getCurrentTime();
    // const formattedDate = this.dataServiceProvider.transformTimestampToDate(now);
    try {
      session = await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {

      user = await this.sessionServiceProvider.getUserFromToken(this.request.headers.authentication);
      const userString = `${user.name[0].toUpperCase()}.${user.last_name}`;
      const workbook = new Excel.Workbook();
      const tempFilePath = `./public/reports/${userString}${now}.xlsx`;
      const worksheet = workbook.addWorksheet('Job Applications', {
        pageSetup: { paperSize: undefined, orientation: 'portrait' }, views: [
          { state: 'frozen', ySplit: 1 }
        ]
      });
      const headerStyle = {
        family: 2,
        size: 11,
        bold: true
      }
      const style = {
        family: 2,
        size: 10,
        bold: false
      }
      let alphabet: string | string[] = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z AA AB AC AD AE AF AG AH AI AJ AK AL AM AN AO AP AQ AR AS AT AU AV AW AX AY AZ BA BB BC BD BE BF BG BH BI BJ BK BL BM BN BO BP BQ BR BS BT BU BV BW BX BY BZ";
      alphabet = alphabet.split(" ");
      const alignment = { vertical: 'center', horizontal: 'center' };
      await this.reportServiceProvider.setWorksheetColumns(worksheet, alignment, headerStyle, alphabet);
      this.reportServiceProvider.setWorksheetData(worksheet, jobApplications, style);
      this.responseObject.data.reportRoute = tempFilePath.slice(1, tempFilePath.length);
      await workbook.xlsx.writeFile(tempFilePath);
      return this.responseObject.successResponse();
    } catch (error) {
      console.log(error)
      return this.responseObject.defaultErrorResponse()
    }
  }

  @get('/status-options')
  async getStatus(
  ): Promise<any> {
    try {
      await this.sessionServiceProvider.checkTokenValidity(this.request.headers['authentication']);
    } catch (error) {
      return this.responseObject.customResponse(true, "Invalid Session", 401);
    }
    try {
      const options = ['Waiting response', 'Testing', 'Interview', 'Job Offer', 'Rejected', 'Accepted'];
      this.responseObject.data = options;
      return this.responseObject.successResponse();
    } catch (error) {
      console.log(error);
      return this.responseObject.customResponse(true, "There was an error while handling the request", 500);
    }
  }

}


