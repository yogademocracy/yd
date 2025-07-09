# Yoga democracy

This repository contains the codebase of Yoga democracy's Salesforce Commerce Cloud (SFCC) project. It is based on a fork of Salesforce's Storefront Reference Architecture (SFRA) containing some changes to the included cartriges and the build process.

## Table of contents

[TOC]

## Introduction
This project is based on a Salesforce Cloud Commerce platform, SFRA Architecture (https://github.com/SalesforceCommerceCloud/storefront-reference-architecture)

## Get informations

### Tools used on project

* [Jira](https://emberagency.atlassian.net/jira/software/c/projects/COL/boards/62), ticketing tool, used to manage User Stories, backlog, sprints and reporting
* [Gitlab](https://github.com/Yoga democracygroup/Yoga democracy-sfcc-refapp), allows users to do basic Git operations (such as reviewing or merging code)
* [Confluence](https://emberagency.atlassian.net/wiki/spaces/Yoga democracy/overview), used to share with PM, Designers, Dev and the client.


The following tools are needed:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

This tools are recommended:

- [Visual Studio Code](https://code.visualstudio.com/) as IDE
- [Atlassian Sourcetree](https://www.sourcetreeapp.com/) as Git GUI

Add Ons for Visual Studio Code:

- [Prophet Debugger](https://marketplace.visualstudio.com/items?itemName=SqrTT.prophet) (for code upload to sandbox and debugger)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [stylelint](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint)
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)


## Setup and build

### Setup for work
1. Clone the repo :

```
git clone git@github.com:Yoga democracygroup/Yoga democracy-sfcc-refapp.git
```

2. Install dependencies and compile assets :

    - Run `npm install` to install all the local dependencies (node version 20.18.3 recommended).

    - Run `npm run dev` in project folder to trigger compilation across all cartridges.


3. Copy `dw.sample.json` to `dw.json` file in the root of the project:
```json
{
    "hostname": "your-sandbox-hostname.demandware.net",
    "username": "yourlogin",
    "password": "yourpwd",
    "code-version": "version_to_upload_to"
}
```

4. Upload compiled code to your sandbox.

5. Import meta data from `site_template` to your sandbox.


### Error pages

Static error pages are located in the `errorpages/` folder.
To add error pages in BM, zip the content of the `errorpages/` folder then upload the archive into Administration / Site Development / Custom error pages.

The content of the archive must be like :

```
errorpages.zip
    ∟ majorerror.html
    ∟ overload.html
    ∟ url_error.html
    ∟ errorPages.css
    ∟ logo.svg
    ∟ ...
```

### Maintenance page

Maintenance page is located in the `maintpages/` folder.
To add maintenance page in BM, zip the content of the `maintpages/www.<domain>.com` folder then upload the archive into Administration / Site Development / Custom maintenance pages.

The content of the archive must be like :

```
maintpages.zip
    ∟ www.Mdomain>.com
        ∟ index.html
        ∟ logo.svg
        ∟ errorPages.css
        ∟ ...
```

## Code style / linting

We use a set of tools to ensure code quality and uniform source code:

- [ESLint](https://eslint.org/) - for JavaScript
- [StyleLint](https://stylelint.io/) - for CSS/SCSS/...

Code from multiple sources is used which has different code styles:

- SFCC (`catridges/app_storefront_base`, `cartridges/modules/server`)
- Yoga democracy (`cartridges/app_Yoga democracy_core`, the build code)
- project specific code (you can feel free to have your own code style for your own code. But we also prepared some useful defaults)

## Pull requests, commit and branch naming standard

### Branch should be named by STORY_JIRA_ID, not sub task ID.
Target branch - develop
- If you develop new feature, it should be placed under feature/STORY_JIRA_ID
- If you fixing bug, it should be placed under bugfix/STORY_JIRA_ID

Examples:
feature/COL-10
bugfix/COL-223

### Every feature commit and PR should consist of:
JIRA_ID:CHANGE_CATEGORY(ADD/FIX/CHANGE): JIRA_TICKET_NAME and DESCRIPTION (optional)

Example:
COL-10:ADD: Cookie banner

## Styleguide
Atlas is integrated to auto-generate Styleguide Browser.
Atlas is living style-guide, pattern library, guidelines and documentation static site generator with extensive styles monitoring and Sass components reports. It generates documentation from markdown files and documentation comment in scss files.

Support /*md comment in scss files where regular markdown could be placed.

Build Atlas Styleguide per Brand i.e.:
```
npm run styleguide:b2c
```
Styleguide will be accessible locally via
```
cartridges/app_yd_core/cartridge/static/default/styleguide/guide/index.html
```

## Icons
We support custom icon fonts creation from SVG

1. Drop icons .svg files to ```client\default\svg\icons\``` (you can use subfolder to create namespaces). Please use lowercase for filenames and dashes to separate words for consistency.

2. Build fonts per Brand i.e.:
```
npm run icons:brand_name
```
Icons will be accessible locally via
```
cartridges/app_brand_name/cartridge/static/default/fonts/icons/icons.html
```

also Atlas Styleguide build should be run after generation of icons to see updated Atlas pages

## Contributing

Contributions to this file are welcome from everyone in order to improve its quality.

