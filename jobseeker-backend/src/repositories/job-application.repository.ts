import {DefaultCrudRepository} from '@loopback/repository';
import {JobApplication, JobApplicationRelations} from '../models';
import {JobSeekingAppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class JobApplicationRepository extends DefaultCrudRepository<
  JobApplication,
  typeof JobApplication.prototype.id,
  JobApplicationRelations
> {
  constructor(
    @inject('datasources.JobSeekingApp') dataSource: JobSeekingAppDataSource,
  ) {
    super(JobApplication, dataSource);
  }
}
