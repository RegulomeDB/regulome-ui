import pytest

from aws_cdk.assertions import Template


def test_stacks_frontend_initialize_frontend_stack(config):
    from aws_cdk import App
    from infrastructure.stacks.frontend import FrontendStack
    from infrastructure.constructs.existing import regulome_dev
    app = App()
    frontend_stack = FrontendStack(
        app,
        'TestFrontendStack',
        config=config,
        existing_resources_class=regulome_dev.Resources,
        env=regulome_dev.US_WEST_2,
    )
    template = Template.from_stack(frontend_stack)
    template.has_resource_properties(
        'AWS::ECS::Service',
        {
            'Cluster': {
                'Ref': 'EcsDefaultClusterMnL3mNNYNVpc18E0451A'
            },
            'DeploymentConfiguration': {
                'DeploymentCircuitBreaker': {
                    'Enable': True,
                    'Rollback': True
                },
                'MaximumPercent': 200,
                'MinimumHealthyPercent': 50
            },
            'DeploymentController': {
                'Type': 'ECS'
            },
            'DesiredCount': 1,
            'EnableECSManagedTags': False,
            'EnableExecuteCommand': True,
            'HealthCheckGracePeriodSeconds': 60,
            'LaunchType': 'FARGATE',
            'LoadBalancers': [
                {
                    'ContainerName': 'nextjs',
                    'ContainerPort': 3000,
                    'TargetGroupArn': {
                        'Ref': 'FrontendFargateLBPublicListenerECSGroupB493F3AB'
                    }
                }
            ],
            'NetworkConfiguration': {
                'AwsvpcConfiguration': {
                    'AssignPublicIp': 'ENABLED',
                    'SecurityGroups': [
                        {
                            'Fn::GetAtt': [
                                'FrontendFargateServiceSecurityGroup52B6B765',
                                'GroupId'
                            ]
                        }
                    ],
                    'Subnets': [
                        's-12345',
                        's-67890'
                    ]
                }
            },
            'Tags': [
                {
                    'Key': 'backend_url',
                    'Value': 'https://gds-some-test-backend.regulomedb.org'
                },
                {
                    'Key': 'branch',
                    'Value': 'some-branch'
                }
            ],
            'TaskDefinition': {
                'Ref': 'FrontendFargateTaskDefC3798D1C'
            }
        }
    )
