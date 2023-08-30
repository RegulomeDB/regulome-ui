from constructs import Construct

from regulome_infrastructure.regulome_prod.connection import CodeStarConnection
from regulome_infrastructure.regulome_prod.environment import US_WEST_2 as US_WEST_2
from regulome_infrastructure.regulome_prod.domain import Domain
from regulome_infrastructure.regulome_prod.secret import DockerHubCredentials
from regulome_infrastructure.regulome_prod.network import Network
from regulome_infrastructure.regulome_prod.notification import Notification
from regulome_infrastructure.regulome_prod.bus import Bus

from typing import Any


class Resources(Construct):

    def __init__(self, scope: Construct, construct_id: str, **kwargs: Any) -> None:
        super().__init__(scope, construct_id, **kwargs)
        self.network = Network(
            self,
            'Network',
        )
        self.domain = Domain(
            self,
            'Domain',
        )
        self.docker_hub_credentials = DockerHubCredentials(
            self,
            'DockerHubCredentials',
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
