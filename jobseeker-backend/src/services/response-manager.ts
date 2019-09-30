import { RestBindings, Response } from '@loopback/rest';
import { inject, Provider } from '@loopback/core';
const util = require('util');

export class ResponseManager implements Provider<any>{
  public err: boolean;
  public data: any;
  public status: number;
  public timestamp: any;
  public message: string;

  constructor(
    @inject(RestBindings.Http.RESPONSE) private response: Response
  ) {
    this.err = false;
    this.message = ' ';
    this.data = {};
    this.timestamp = new Date().getTime();
    this.status = 200;
  }

  value(): any {
    return 'Response Manager'
  };

  returnAnswer() {
    this.timestamp = this.timestamp / 1000;
    this.timestamp = this.timestamp;
    return this.response
      .status(this.status)
      .type('application/json')
      .send({
        error: this.err,
        message: this.message,
        data: this.data,
        timestamp: this.timestamp
      })
  }


  validateRequest(data: any, verifierObject: any) {
    Object.keys(verifierObject).map((keyProperty, index) => {
      if (!data.hasOwnProperty(keyProperty)) {
        this.message = `Field ${keyProperty} is required`;
        this.status = 422;
        this.err = true;
        throw ('Error');
      } else {
        if (verifierObject[keyProperty] !== 'required') {
          try {
            this.caseTypeVars(verifierObject[keyProperty], data, keyProperty);
          } catch (error) {
            throw ('Error');
          }
        }
      }
    }, this);
  }

  caseTypeVars(typeData: string, data: any, key: string) {
    switch (typeData) {
      case 'number':
        if (typeof data[key] !== 'number') {
          this.message = `Field  ${key}  is not numeric`;
          this.status = 422;
          this.err = true;
          throw ('Error');
        }
        break;
      case 'string':
        if (typeof (data[key]) !== "string") {
          this.message = `Field  ${key}  is not a string`;
          this.status = 422;
          this.err = true;
          throw ('Error');
        }
        break;

      case 'array':
        if (!util.isArray(data[key])) {
          this.message = `Field  ${key}  is not an array`;
          this.status = 422;
          this.err = true;
          throw ('Error');
        }
        break;
      case 'object':
        if (typeof (data[key]) !== "object") {
          this.message = `Field  ${key}  is not an object`;
          this.status = 422;
          this.err = true;
          throw ('Error');
        }
        break;
      case 'boolean':
        if (typeof (data[key]) !== "boolean") {
          this.message = `Field  ${key}  is not boolean`;
          this.status = 422;
          this.err = true;
          throw ('Error');
        }
        break;
      default:
        this.message = `Type of ${key} not found`;
        this.status = 500;
        this.err = true;
        throw ('Error');
    }
  };

  modifiedAnswer(err: boolean, message: string, status: number) {
    this.err = err;
    this.message = message;
    this.status = status;
    return this.returnAnswer();
  };

  successAnswer() {
    this.err = false;
    this.message = "Successful operation";
    this.status = 200;
    return this.returnAnswer();
  };

  errorAnswer() {
    this.err = true;
    this.message = "There's been an error";
    this.status = 500;
    return this.returnAnswer();
  };
}
