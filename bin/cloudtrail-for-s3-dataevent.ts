#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CloudTrailS3DataEventStack } from '../lib/s3-clourtrail-dataevent';

const app = new cdk.App();

new CloudTrailS3DataEventStack(app, 'CloudTrailS3DataEvent', {
  cloudtrailName: 'cloudtrailTest'
});
