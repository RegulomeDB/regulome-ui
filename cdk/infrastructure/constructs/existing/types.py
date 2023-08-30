from infrastructure.constructs.existing.regulome_dev import Resources as REGULOMEDevResources
from infrastructure.constructs.existing.regulome_prod import Resources as REGULOMEProdResources

from typing import Union

from typing import Type


ExistingResources = Union[
    REGULOMEDevResources,
    REGULOMEProdResources,
]

ExistingResourcesClass = Union[
    Type[REGULOMEDevResources],
    Type[REGULOMEProdResources],
]
