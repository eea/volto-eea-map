# volto-eea-map

[![Releases](https://img.shields.io/github/v/release/eea/volto-eea-map)](https://github.com/eea/volto-eea-map/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-eea-map%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-eea-map/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-eea-map%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-eea-map/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map&branch=develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map&branch=develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map&branch=develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map&branch=develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map&branch=develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map&branch=develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-map&branch=develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-map&branch=develop)

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

## Getting started

### Upgrade

#### 3.0.0 -> requires >= eea.api.dataconnector@7.0

### Try volto-eea-map with Docker

      git clone https://github.com/eea/volto-eea-map.git
      cd volto-eea-map
      make
      make start

Go to http://localhost:3000

`make start` now defaults to Volto 18. To run the same setup against Volto 17, use:

      VOLTO_VERSION=17 make
      VOLTO_VERSION=17 make start

### Add volto-eea-map to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

- If you already have a volto project, just update `package.json`:

  ```JSON
  "dependencies": {
      "@eeacms/volto-eea-map": "*"
  }
  ```

   and `volto.config.js`:

   ```JavaScript
   const addons = ['@eeacms/volto-eea-map'];
   ```

- If not, create one with Cookieplone, as recommended by the official Plone documentation for Volto 18+:

  ```
  uvx cookieplone project
  cd project-title
  ```

1. Install or update dependencies, then start the project:

   ```
   make install
   ```

   For a Cookieplone project, start the backend and frontend in separate terminals:

   ```
   make backend-start
   make frontend-start
   ```

   For a legacy Volto 17 project, install the package with `yarn` and restart the frontend as usual.

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-eea-map/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-eea-map/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-eea-map/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
