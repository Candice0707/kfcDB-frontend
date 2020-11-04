# KfcDBFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Ubuntu system setup
Angular requires a specific version of node.js. Please follow the following instructions for setup on an Ubuntu system.
```
cd ~/Downloads
wget https://nodejs.org/dist/v12.8.1/node-v12.8.1-linux-x64.tar.xz
cd /usr/local
sudo tar --strip-components=1 -xvf ~/Downloads/node-v12.8.1-linux-x64.tar.xz
rm -f CHANGELOG.md LICENSE README.md
```
### Verification
`node --version` should print `v12.8.1`.

`npm --version` should print `6.10.2`.

## Angular setup
1. Navigate to the current directory
2. `sudo npm install -g @angular/cli`
3. `npm install`


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
