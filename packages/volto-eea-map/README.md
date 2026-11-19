# @eeacms/volto-eea-map

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

## Upgrade

### Upgrading to 7.x

> This version requires `Volto 18` or `Volto 19` and Node.js 22.

No API or behaviour change: the blocks, the schema fields, the settings keys and the stored block data
are the same as 6.x, so an upgrade renders the same maps. The release adds Volto 19 support and moves
the repository to the Volto 19 layout, where the published package lives in
`packages/volto-eea-map`.

#### Breaking changes

- **Node.js 22 or newer is required** (`engines.node >= 22`), 6.x declared no engine.
- **React 18 is required.** The package declares `react` and `react-dom` as `^18.2.0` peers, 6.x
  declared no peers.
- **The package no longer ships the repository tooling.** The Cypress specs and the Jest setup are
  gone and the unit tests moved to Vitest next to the add-on, so nothing a site imports was removed.

## Requirements

### Backend

- [Plone](https://plone.org/download)
- [plone.restapi](https://pypi.org/project/plone.restapi/)

### Frontend

- Node.js: `>=22.0.0`

## Installation

#### 3.0.0 -> requires >= eea.api.dataconnector@7.0

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

1. Go to http://localhost:3000

1. Happy editing!

## License

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
