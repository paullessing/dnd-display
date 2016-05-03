var serveStatic = require('serve-static');
var historyApiFallback = require('connect-history-api-fallback');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ['dist/**/*' ,'dist/**/.*']
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            src: ['app/**/*', 'index.html', 'style/**/*'],
            dest: 'dist'
          }
        ]
      }
    },
    watch: {
      staticFiles: {
        files: ['app/**/*', 'index.html', 'style/**/*'],
        tasks: ['newer:copy:main'],
        options: {
          livereload: 30000
        }
      },
      compiledjs: {
        files: ['dist/**/*.js'],
        options: {
          livereload: 30000
        }
      }
      //ts: {
      //  files: ['app/**/*.ts'],
      //  tasks: ['ts:app'],
      //  options: {
      //    livereload: 30000
      //  }
      //}
    },
    run: {
      sass: {
        cmd: 'sass',
        args: ['style/style.scss', 'dist/style/style.css']
      },
      tswait: {
        cmd: 'tsc',
        // args: ['--listFiles']
      },
      ts: {
        options: {
          wait: false
        },
        cmd: 'tsc',
        args: ['-w']
      }
    },
    ts: {
      app: {
        tsconfig: true,
        options: {
          fast: 'never'
        }
      },
      "build-and-watch": {
        tsconfig: true,
        watch: 'app',
        options: {
          fast: 'never'
        }
      }
    },
    connect: {
      dev: {
        options: {
          port: 9000,
          //hostname: 'localhost',
          base: 'dist',
          useAvailablePort: true,
          livereload: 30000,
          middleware: function(connect, options, middlewares) {
            return [
              historyApiFallback()
            ].concat(
              middlewares
            ).concat([
              connect().use(
                '/node_modules',
                serveStatic('./node_modules')
              )
            ]);
          }
        }
      }
    }
  });

  grunt.registerTask('serve', ['clean', 'copy', 'run:tswait', 'connect:dev', 'run:ts', 'watch']);
  grunt.registerTask('build', ['clean', 'copy', 'run:sass', 'run:tswait']);
};
