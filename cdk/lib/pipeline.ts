import { Stack, StackProps } from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { WebsiteStage } from "./stage";
import { BETA, PROD } from "../env/accounts";

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'PlateCalculator',
            crossAccountKeys: true,
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.connection('evanparizot/plate-calculator', 'master', {
                    connectionArn: 'arn:aws:codestar-connections:us-east-2:767397943677:connection/c8718947-9f9c-4f76-8fde-9cd3640254f6'
                }),
                commands: [
                    'npm install',
                    'npm run build',
                    'cd cdk',
                    'npm install',
                    'npx cdk synth'
                ],
                primaryOutputDirectory: 'cdk/cdk.out'
            })
        });

        pipeline.addStage(new WebsiteStage(this, 'Beta', {
            env: BETA,
            domain: 'beta.platecalculator.net'
        }));

        pipeline.addStage(new WebsiteStage(this, 'Prod', {
            env: PROD,
            domain: 'platecalculator.net'
        }));
    }
}