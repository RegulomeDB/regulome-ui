import pytest


def test_config_exists():
    from infrastructure.config import config
    assert 'demo' in config['environment']
    assert 'demo' in config['pipeline']


def test_config_common_dataclass():
    from infrastructure.config import Common
    common = Common()
    assert common.organization_name == 'regulomedb'
    assert common.project_name == 'regulome-ui'


def test_config_config_dataclass():
    from infrastructure.config import Config
    config = Config(
        name='demo',
        branch='xyz-branch',
        frontend={},
        backend_url='https://test.backend.org',
        tags=[
            ('test', 'tag'),
        ]
    )
    assert config.common.organization_name == 'regulomedb'
    assert config.common.project_name == 'regulome-ui'
    assert config.branch == 'xyz-branch'
    assert config.frontend == {}
    assert config.backend_url == 'https://test.backend.org'
    assert config.tags == [('test', 'tag')]


def test_config_pipeline_config_dataclass():
    from infrastructure.config import PipelineConfig
    from infrastructure.constructs.existing import regulome_dev
    config = PipelineConfig(
        name='demo',
        branch='xyz-branch',
        pipeline='xyz-pipeline',
        existing_resources_class=regulome_dev.Resources,
        account_and_region=regulome_dev.US_WEST_2,
        tags=[
            ('abc', '123'),
            ('xyz', '321'),
        ]
    )
    assert config.common.organization_name == 'regulomedb'
    assert config.common.project_name == 'regulome-ui'
    assert config.existing_resources_class == regulome_dev.Resources
    assert config.account_and_region == regulome_dev.US_WEST_2
    assert config.branch == 'xyz-branch'
    assert config.pipeline == 'xyz-pipeline'
    assert config.tags == [
        ('abc', '123'),
        ('xyz', '321'),
    ]


def test_config_build_config_from_name():
    from infrastructure.config import build_config_from_name
    config = build_config_from_name(
        'demo',
        branch='my-branch',
        backend_url='http://my-specific-endpoint.org',
        frontend={},
    )
    assert config.common.organization_name == 'regulomedb'
    assert config.common.project_name == 'regulome-ui'
    assert config.branch == 'my-branch'
    assert config.frontend == {}
    assert config.name == 'demo'
    assert config.backend_url == 'http://my-specific-endpoint.org'
    config = build_config_from_name(
        'dev',
        branch='my-branch',
    )
    assert config.common.organization_name == 'regulomedb'
    assert config.common.project_name == 'regulome-ui'
    assert config.branch == 'my-branch'
    assert config.frontend
    assert config.name == 'dev'
    assert config.backend_url == 'https://gds-for-regulome-demo.demo.regulomedb.org'


def test_config_build_config_from_name_demo(mocker):
    from infrastructure.config import build_config_from_name
    config = build_config_from_name(
        'demo',
        branch='my-branch',
        # Overrides.
        frontend={}
    )
    assert config.backend_url == 'https://gds-for-regulome-demo.demo.regulomedb.org'


def test_config_build_pipeline_config_from_name():
    from aws_cdk import Environment
    from infrastructure.constructs.existing import regulome_dev
    from infrastructure.config import build_pipeline_config_from_name
    config = build_pipeline_config_from_name(
        'demo',
        branch='my-branch',
        pipeline='my-pipeline',
    )
    assert config.common.organization_name == 'regulomedb'
    assert config.common.project_name == 'regulome-ui'
    assert ('time-to-live-hours', '72') in config.tags
    assert config.branch == 'my-branch'
    assert config.pipeline == 'my-pipeline'
    assert config.name == 'demo'
    config = build_pipeline_config_from_name(
        'dev',
        branch='my-branch',
    )
    assert config.common.organization_name == 'regulomedb'
    assert config.common.project_name == 'regulome-ui'
    assert config.pipeline == 'DevDeploymentPipelineStack'
    assert config.name == 'dev'
    assert isinstance(config.account_and_region, Environment)
    assert config.existing_resources_class == regulome_dev.Resources


def test_config_build_config_from_branch():
    from infrastructure.config import get_config_name_from_branch
    config_name = get_config_name_from_branch('IGVF-123-add-new-feature')
    assert config_name == 'demo'
    config_name = get_config_name_from_branch('dev')
    assert config_name == 'dev'


def test_config_get_pipeline_config_name_from_branch():
    from infrastructure.config import get_pipeline_config_name_from_branch
    config_name = get_pipeline_config_name_from_branch(
        'IGVF-123-add-new-feature')
    assert config_name == 'demo'
    config_name = get_pipeline_config_name_from_branch('dev')
    assert config_name == 'dev'
    config_name = get_pipeline_config_name_from_branch('main')
    assert config_name == 'production'


def test_config_Config():
    from infrastructure.config import Config
    kwargs = {
        'name': 'some-name',
        'branch': 'some-branch',
        'frontend': {},
        'tags': [('abc', '123')]
    }
    with pytest.raises(TypeError):
        config = Config(**kwargs)
    kwargs.update({'backend_url': 'some-backend-url'})
    config = Config(**kwargs)
    assert isinstance(config, Config)
