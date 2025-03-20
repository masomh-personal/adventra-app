# 📂 Project Folder Structure

This document outlines the **folder structure** of the Adventra project. It serves as a guide for team members to understand how files are organized.

## Directory Structure
```
...\adventra-app
├── eslint.config.mjs
├── jest.config.js
├── jest.setup.js
├── jsconfig.json
├── LICENSE.txt
├── next.config.mjs
├── output.txt
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
|  ├── adventra-logo.png
|  ├── favicon.ico
|  └── media
|     └── hiking.mp4
├── README.md
├── src
|  ├── components
|  |  ├── Button.js
|  |  ├── Footer.js
|  |  ├── Header.js
|  |  └── __tests__
|  |     ├── Button.test.js
|  |     ├── Footer.test.js
|  |     └── Header.test.js
|  ├── lib
|  |  └── supabaseClient.js
|  ├── pages
|  |  ├── about.js
|  |  ├── api
|  |  |  ├── auth
|  |  |  |  ├── login.js
|  |  |  |  └── signup.js
|  |  |  ├── hello.js
|  |  |  ├── match
|  |  |  |  ├── index.js
|  |  |  |  └── status.js
|  |  |  ├── messages
|  |  |  |  └── index.js
|  |  |  ├── profiles
|  |  |  |  └── [id].js
|  |  |  └── users
|  |  |     ├── index.js
|  |  |     └── [id].js
|  |  ├── contact.js
|  |  ├── index.js
|  |  ├── login.js
|  |  ├── privacy-policy.js
|  |  ├── signup.js
|  |  ├── _app.js
|  |  ├── _document.js
|  |  └── __tests__
|  |     ├── about.test.js
|  |     ├── contact.test.js
|  |     ├── index.test.js
|  |     ├── login.test.js
|  |     ├── privacy-policy.test.js
|  |     └── signup.test.js
|  ├── services
|  |  ├── matchesService.js
|  |  ├── mesagesService.js
|  |  ├── profilesService.js
|  |  └── usersService.js
|  └── styles
|     └── globals.css
├── structure.md
├── _docs
|  ├── backlog-prioritization.md
|  ├── FOLDER_STRUCTURE.md
|  ├── product-vision.md
|  └── style-guide.md
└── _sprints
   └── sprint1
      ├── backlogtasks.md
      ├── burndown
      |  ├── Sprint 1 Burndown Chart version 1.xlsx
      |  ├── Sprint 1 Burndown Chart version 2.xlsx
      |  └── Sprint 1 Burndown Chart version 3.xlsx
      ├── dailyscrumpictures
      |  ├── DailyScrum1.png
      |  └── DailyScrum2.png
      ├── dailyscrums.md
      ├── mobcode.md
      ├── mobcodepictures
      |  ├── MobCode1.png
      |  ├── MobCode2.png
      |  ├── MobCode3.png
      |  └── MobCode4.png
      ├── sprint1-forecastrationale.md
      ├── sprint1_test_coverage.png
      └── sprintreview.md
```

```bash
## use this command to recreate the folder structure
npx tree-cli -l 5 --ignore 'node_modules/, .git/, .gitignore, coverage' -o _docs/folder_structure.txt
```
