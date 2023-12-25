import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CloudTrailS3DataEventStack } from '../lib/s3-clourtrail-dataevent';

describe('CDK Stack Testing', () => {
  test('Cloudtrail DataEvent Testing', () => {
    const app = new App();
    // WHEN
    const CloudTrailS3Dataeventstack = new CloudTrailS3DataEventStack(app, 'LambdaPCScalingTargetStackTest', {
        cloudtrailName: 'cloudtrailTest'
      }
    );
    const targetAssert = Template.fromStack(CloudTrailS3Dataeventstack);
    // THEN
    targetAssert.resourceCountIs('AWS::S3::Bucket', 1);
    targetAssert.resourceCountIs('AWS::CloudTrail::Trail', 1);
  });
});

