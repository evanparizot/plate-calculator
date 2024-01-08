import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { AllowedMethods, Distribution, OriginAccessIdentity, SecurityPolicyProtocol, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ARecord, AaaaRecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path = require('path');

export interface WebsiteStackProps extends StackProps {
  domain: string;
  subDomain?: string;
}

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    const zone = HostedZone.fromLookup(this, 'Zone', { domainName: props.domain });
    const siteDomain = props.subDomain ? props.subDomain + '.' + props.domain : props.domain;


    const bucket = new Bucket(this, 'Bucket', {
      accessControl: BucketAccessControl.PRIVATE,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY
    });


    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    bucket.grantRead(originAccessIdentity);


    const certificate = new Certificate(this, 'Certificate', {
      domainName: siteDomain,
      validation: CertificateValidation.fromDns(zone)
    });

    const distribution = new Distribution(this, 'Distribution', {
      certificate,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(bucket, { originAccessIdentity }),
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      domainNames: [siteDomain],
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: '/error.html',
          ttl: Duration.minutes(30)
        }
      ],
    });

    const target = RecordTarget.fromAlias(new CloudFrontTarget(distribution));

    new ARecord(this, 'ARecord', {
      zone,
      recordName: siteDomain,
      target
    })

    new AaaaRecord(this, 'AAAARecord', {
      zone: zone,
      recordName: siteDomain,
      target
    });

    new BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: bucket,
      sources: [Source.asset(path.resolve(__dirname, '..', '..', 'build'))],
      distribution,
      distributionPaths: ['/*']
    });
  }
}
