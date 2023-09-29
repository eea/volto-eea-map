# volto-eea-map

[![Releases](https://img.shields.io/github/v/release/eea/volto-eea-map)](https://github.com/eea/volto-eea-map/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-eea-map%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-eea-map/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-eea-map%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-eea-map/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map-develop)

[Volto](https://github.com/plone/volto) add-on

# Configuration

This addon contains the EEA Embed Map Block & EEA Map Block. It's configured to work with the map visualization content type and give more access to ArcGIS maps. See available maps here https://discomap.eea.europa.eu/ 

# Enable data queries auto-import 

To enable automatic import of queries from the content-type, "Parameters for data connections" should be checked as behavior on the content-type that uses the map. 

    controlpanel/dexterity-types/{content-type-id}

# Enable Sources

Sources (Data provenance) should be set on the visualization. To enable this, "EEA Core Metadata" should be  checked as behavior on the  visualization content-type. 

    controlpanel/dexterity-types/map_visualization
    
After this, sources can be added from the visualization edit interface. "Data Provenance" tab => "Add source"

## Getting started

### Try volto-eea-map with Docker

      git clone https://github.com/eea/volto-eea-map.git
      cd volto-eea-map
      make
      make start

Go to http://localhost:3000

### Add volto-eea-map to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-eea-map"
   ],

   "dependencies": {
       "@eeacms/volto-eea-map": "*"
   }
   ```

* If not, create one:

   ```
   npm install -g yo @plone/generator-volto
   yo @plone/volto my-volto-project --canary --addon @eeacms/volto-eea-map
   cd my-volto-project
   ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-addon-template/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-addon-template/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-addon-template/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
