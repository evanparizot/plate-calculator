#!/usr/bin/env node
import { PipelineStack } from '../lib/pipeline';
import { BETA } from '../env/accounts';
import { App } from 'aws-cdk-lib';

const app = new App();
new PipelineStack(app, 'PipelineStack', {env: BETA});
app.synth();