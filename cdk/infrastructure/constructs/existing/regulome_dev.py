from constructs import Construct

from regulome_infrastructure.regulome_dev.connection import CodeStarConnection
from regulome_infrastructure.regulome_dev.environment import US_WEST_2 as US_WEST_2
from regulome_infrastructure.regulome_dev.domain import Domain as DemoDomain
from regulome_infrastructure.regulome_dev.secret import DockerHubCredentials
from regulome_infrastructure.regulome_dev.network import Network as DemoNetwork
from regulome_infrastructure.regulome_dev.notification import Notification
from regulome_infrastructure.regulome_dev.bus import Bus
from regulome_infrastructure.regulome_dev.secret import PortalCredentials

from typing import Any


class Resources(Construct):

    def __init__(self, scope: Construct, construct_id: str, **kwargs: Any) -> None:
        super().__init__(scope, construct_id, **kwargs)
        self.network = DemoNetwork(
            self,
            'DemoNetwork',
        )
        self.domain = DemoDomain(
            self,
            'DemoDomain',
        )
        self.docker_hub_credentials = DockerHubCredentials(
            self,
            'DockerHubCredentials',
        )
        self.portal_credentials = PortalCredentials(
            self,
            'PortalCredentials',
        )
        self.code_star_connection = CodeStarConnection(
            self,
            'CodeStarConnection',
        )
        self.notification = Notification(
            self,
            'Notification',
        )
        self.bus = Bus(
            self,
            'Bus',
        )
