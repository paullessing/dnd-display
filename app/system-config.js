System.config({
  packages: {
    app: {
      format: 'register',
      defaultExtension: 'js'
    },
    angular2: {
      defaultExtension: 'js',
      format: 'cjs'
    },
    rxjs: {
      defaultExtension: 'js',
      format: 'cjs'
    }
  },
  map: {
    'moment': '/node_modules/moment/moment.js',
    'angular2': '/node_modules/angular2',
    'rxjs': '/node_modules/rxjs'
  }
});
