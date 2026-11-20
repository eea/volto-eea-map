# volto-eea-map

[![Releases](https://img.shields.io/github/v/release/eea/volto-eea-map)](https://github.com/eea/volto-eea-map/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-eea-map%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-eea-map/job/master/display/redirect)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map)

[Volto](https://github.com/plone/volto) add-on
# Configuration
This addon contains the EEA Embed Map Block & EEA Map Block. It's configured to work with the map visualization content type and give more access to ArcGIS maps. See available maps here https://discomap.eea.europa.eu/
# Enable data queries auto-import
To enable automatic import of queries from the content-type, "Parameters for data connections" should be checked as behavior on the content-type that uses the map.
    controlpanel/dexterity-types/{content-type-id}
# Enable Sources
Sources (Data provenance) should be set on the visualization. To enable this, "EEA Core Metadata" should be checked as behavior on the visualization content-type.
    controlpanel/dexterity-types/map_visualization
After this, sources can be added from the visualization edit interface. "Data Provenance" tab => "Add source"
[EEA MAP](https://raw.githubusercontent.com/eea/volto-eea-map/master/docs/volto-eea-map.gif)

The add-on package lives in [`packages/volto-eea-map`](packages/volto-eea-map),
its [README](packages/volto-eea-map/README.md) documents installation and usage.

## Development

See [DEVELOP.md](DEVELOP.md).

## Release

See [RELEASE.md](RELEASE.md).

## License

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
