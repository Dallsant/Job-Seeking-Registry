import { RestBindings, Response } from '@loopback/rest';
import { inject, Provider } from '@loopback/core';
const util = require('util');

export class ResponseManager implements Provider<any>{
  public error: boolean;
  public data: any;
  public status: number;
  public timestamp: any;
  public message: string;

  constructor(
    @inject(RestBindings.Http.RESPONSE) private response: Response
  ) {
    this.error = false;
    this.message = '';
    this.data = {};
    this.timestamp = new Date().getTime();
    this.status = 200;
  }

  value(): any {
    return 'Response Manager'
  };

  setResponse() {
    this.timestamp = Math.floor(this.timestamp / 1000);
    return this.response
      .status(this.status)
      .type('application/json')
      .send({
        error: this.error,
        message: this.message,
        data: this.data,
        timestamp: this.timestamp
      })
  }

  validateRequest(data: any, objectVerificationect: any) {
    Object.keys(objectVerificationect).map((keyProperty, index) => {
      if (!data.hasOwnProperty(keyProperty)) {
        this.message = `Field ${keyProperty} is required`;
        this.status = 422;
        this.error = true;
        throw ('Error');
      } else {
        if (objectVerificationect[keyProperty] !== 'required') {
          try {
            this.verifyTyping(objectVerificationect[keyProperty], data, keyProperty);
          } catch (error) {
            throw (error);
          }
        }
      }
    }, this);
  }

  // Validation the typing of the request sent by the User
  verifyTyping(dataType: string, data: any, key: string) {
    switch (dataType) {
      case 'number':
        if (typeof data[key] !== 'number') {
          this.message = `Field  ${key}  is not numeric`;
          this.status = 422;
          this.error = true;
          throw ('Error');
        }
        break;
      case 'string':
        if (typeof (data[key]) !== "string") {
          this.message = `Field  ${key}  is not a string`;
          this.status = 422;
          this.error = true;
          throw ('Error');
        }
        break;
      case 'array':
        if (!util.isArray(data[key])) {
          this.message = `Field  ${key}  is not an array`;
          this.status = 422;
          this.error = true;
          throw ('Error');
        }
        break;
      case 'object':
        if (typeof (data[key]) !== "object") {
          this.message = `Field  ${key}  is not an object`;
          this.status = 422;
          this.error = true;
          throw ('Error');
        }
        break;
      case 'boolean':
        if (typeof (data[key]) !== "boolean") {
          this.message = `Field  ${key}  is not boolean`;
          this.status = 422;
          this.error = true;
          throw ('Error');
        }
        break;

        case 'password':
        if (typeof (data[key]) !== "string") {
          this.message = `Field  ${key}  is not boolean`;
          this.status = 422;
          this.error = true;
          throw ('Error');
        }else if(data[key].length < 8){
          this.message = `Password's ${key} length must be at least 8 characters`;
          this.status = 422;
          this.error = true;
        }
        break;

      default:
        this.message = `Type of ${key} not found`;
        this.status = 500;
        this.error = true;
        throw ('Error');
    }
  };

  customResponse(err: boolean, message: string, status: number) {
    this.error = err;
    this.message = message;
    this.status = status;
    return this.setResponse();
  };

  successResponse() {
    this.error = false;
    this.message = "Successful operation";
    this.status = 200;
    return this.setResponse();
  };

  defaultErrorResponse() {
    this.error = true;
    this.message = "There's been an error";
    this.status = 500;
    return this.setResponse();
  };
}
