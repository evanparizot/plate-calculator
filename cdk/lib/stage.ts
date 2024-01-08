import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { WebsiteStack } from "./website";

export interface WebsiteStageProps extends StageProps {
    domain: string;
    subDomain?: string;
}

export class WebsiteStage extends Stage {
    constructor(scope: Construct, id: string, props: WebsiteStageProps) {
        super(scope, id, props);

        const stack = new WebsiteStack(this, 'WebsiteStack', {
            domain: props.domain,
            subDomain: props.subDomain
        });
    }
}