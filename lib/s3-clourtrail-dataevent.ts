import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from 'constructs';
// import { Bucket,ObjectOwnership }from 'aws-cdk-lib/aws-s3';
import * as s3 from 'aws-cdk-lib/aws-s3';

import { CfnTrail } from 'aws-cdk-lib/aws-cloudtrail';
import { PolicyStatement, Effect, ServicePrincipal }from 'aws-cdk-lib/aws-iam';


interface CloudTrailS3DataEventStackProps extends StackProps {
  cloudtrailName: string
}

export class CloudTrailS3DataEventStack extends Stack {
  private cloudtrailName: string

  constructor(scope: Construct, id: string, props: CloudTrailS3DataEventStackProps) {
    super(scope, id, props);
    this.cloudtrailName = props.cloudtrailName

    const bucket = new s3.Bucket(this, 'DataBucketTest', {
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
    });
    bucket.addToResourcePolicy(
      new PolicyStatement({
        sid: "AWSCloudTrailAclCheck",
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal("cloudtrail.amazonaws.com")],
        actions: ["s3:GetBucketAcl"],
        resources: [bucket.bucketArn],
        conditions: {
          StringEquals: {
            "AWS:SourceArn": `arn:aws:cloudtrail:${Stack.of(this).region}:${Stack.of(this).account}:trail/${this.cloudtrailName}`,
          },
        },
      }),
    );
    bucket.addToResourcePolicy(
      new PolicyStatement({
        sid: "AWSCloudTrailOrgWrite",
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal("cloudtrail.amazonaws.com")],
        actions: ["s3:PutObject"],
        resources: [`${bucket.bucketArn}/AWSLogs/304179817986/*`],
        conditions: {
          StringEquals: {
            "s3:x-amz-acl": "bucket-owner-full-control",
            "AWS:SourceArn": `arn:aws:cloudtrail:${Stack.of(this).region}:${Stack.of(this).account}:trail/${this.cloudtrailName}`,
          },
        },
      }),
    );

    new CfnTrail(this, `CloudTrail`, {
      isLogging: true,
      trailName: this.cloudtrailName,
      s3BucketName: bucket.bucketName, 
    });
  }
  };
