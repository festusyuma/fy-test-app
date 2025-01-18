#!/usr/bin/env node
const cdk = require("aws-cdk-lib");
const { FullStackConstruct, AppType } = require("@fy-stack/fullstack-construct");

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

const environment = process.env.ENVIRONMENT
if (!environment) throw new Error("ENVIRONMENT is required");

class AppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    
    const domainName = process.env.ENVIRONMENT === "production" ? "test.festusyuma.com" : `${process.env.ENVIRONMENT}.test.festusyuma.com`

    const app = new FullStackConstruct(this, "App", {
      storage: { retainOnDelete: false },
      apps: {
        web: {
          type: AppType.STATIC_WEBSITE,
          output: "./static"
        }
      },
      cdn: {
        routes: {
          "/*": { $resource: "web" }
        }
      }
    });

    cdk.Tags.of(this).add("App", "test-app");
  }
}

const app = new cdk.App();
new AppStack(
  app,
  "app",
  { env, stackName: `test-app-${process.env.ENVIRONMENT}` }
);