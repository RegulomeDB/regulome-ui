from aws_cdk import Stage

from constructs import Construct

from infrastructure.constructs.existing import igvf_dev

from infrastructure.config import Config
from infrastructure.stacks.frontend import FrontendStack

from typing import Any


class DevelopmentDeployStage(Stage):

    def __init__(
            self,
            scope: Construct,
            construct_id: str,
            *,
            config: Config,
            **kwargs: Any
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)
        self.frontend_stack = FrontendStack(
            self,
            'FrontendStack',
            config=config,
            existing_resources_class=igvf_dev.Resources,
            env=igvf_dev.US_WEST_2,
        )