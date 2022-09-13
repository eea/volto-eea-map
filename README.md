# volto-addon-template

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

# volto-eea-map

Before starting make sure your development environment is properly set. See [Volto Developer Documentation](https://docs.voltocms.com/getting-started/install/)

1.  Make sure you have installed `yo`, `@plone/generator-volto` and `mrs-developer`

        npm install -g yo @plone/generator-volto mrs-developer

1.  Create new volto app

        yo @plone/volto my-volto-project --addon @eeacms/volto-eea-map --skip-install
        cd my-volto-project

1.  Add the following to `mrs.developer.json`:

        {
            "volto-eea-map": {
                "url": "https://github.com/eea/volto-eea-map.git",
                "package": "@eeacms/volto-eea-map",
                "branch": "develop",
                "path": "src"
            }
        }

1.  Install

        yarn develop
        yarn

1.  Start backend

        docker pull plone
        docker run -d --name plone -p 8080:8080 -e SITE=Plone -e PROFILES="profile-plone.restapi:blocks" plone

    ...wait for backend to setup and start - `Ready to handle requests`:

        docker logs -f plone

    ...you can also check http://localhost:8080/Plone

1.  Start frontend

        yarn start

1.  Go to http://localhost:3000

1.  Happy hacking!

        cd src/addons/volto-eea-map/

# Configuration

This addon contains the EEA Embed Map Block & EEA Map Block. It's configured to work with the map visualization content type and give more access to ArcGIS maps. See available maps here https://discomap.eea.europa.eu/ 

# Enable data queries auto-import 

To enable automatic import of queries from the content-type, "Parameters for data connections" should be checked as behavior on the content-type that uses the map. 

    controlpanel/dexterity-types/{content-type-id}
# Enable Sources

Sources (Data provenance) should be set on the visualization. To enable this, "EEA Core Metadata" should be  checked as behavior on the  visualization content-type. 

    controlpanel/dexterity-types/map_visualization
    
After this, sources can be added from the visualization edit interface. "Data Provenance" tab => "Add source"


