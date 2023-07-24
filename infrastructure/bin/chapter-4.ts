#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Chapter3Stack } from '../lib/chapter-4-stack';
// Add cdk-nag checks 
import { AwsSolutionsChecks } from 'cdk-nag'
import { Aspects } from 'aws-cdk-lib';

const app = new cdk.App();
// Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
// Original Chapter4Stack below
new Chapter3Stack(app, 'Chapter4Stack', {
//  env: { region: 'us-east-1', account: process.env.CDK_DEFAULT_ACCOUNT },
    env: { account: '507370583167', region: 'us-east-1' },
});
