module.exports = function (grunt) {
  'use strict';

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! { ' +
    '"name": "<%= pkg.name %>", ' +
    '"version": "<%= pkg.version %>", ' +
    '<%= pkg.homepage ? "\\"homepage\\": \\"" + pkg.homepage + "\\"," : "" %>' +
    '"copyright": "(c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>" ' +
    '} */\n',

    dirs: {
      tmp: './tmp',
      dist: './dist',
      src: './lib',
      docs: './dist/docs',
      coverage: '<%= dirs.dist %>/coverage'
    },
    clean: {
      tmp: {
        src: ['<%= dirs.tmp %>']
      },
      docs: {
        src: ['<%= dirs.docs %>']
      },
      dist: {
        src: ['<%= dirs.dist %>']
      }
    },
    concat: {
      tmp: {
        src: [
          '<%= dirs.src %>/<%= pkg.name %>.js'
        ],
        dest: '<%= dirs.tmp %>/<%= pkg.name %>.js'
      }
    },
    umd: {
      all: {
        options: {
          src: '<%= concat.tmp.dest %>',
          dest: '<%= concat.tmp.dest %>',
          template: './templates/umd-vissense-no-conflict.hbs',
          objectToExport: 'VisSense',
          indent: 2
        }
      }
    },
    uglify: {
      src: {
        options: {
          banner: '<%= banner %>',
          compress: {
            drop_console: true
          },
          sourceMap: false,
          preserveComments: false,
          beautify: true,
          mangle: false
        },
        src: '<%= concat.tmp.dest %>',
        dest: '<%= dirs.dist %>/<%= pkg.name %>.js'
      },
      dist: {
        options: {
          banner: '',
          report: 'gzip',
          compress: {
            drop_console: true
          },
          sourceMap: false
        },
        src: '<%= concat.tmp.dest %>',
        dest: '<%= dirs.dist %>/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      karma: {
        src: ['karma.conf.js', 'karma-saucelabs.conf.js']
      },
      src_test: {
        src: ['tmp/**/*.js', 'lib/**/*.js', 'spec/**/*.js']
      }
    },
    connect: {
      server: {
        options: {
          keepalive: true,
          hostname: 'localhost',
          port: 3000,
          base: './',
          livereload: true,
          open: 'http://localhost:3000/SpecRunner.html'
        }
      },
      docs: {
        options: {
          open: true,
          keepalive: true,
          hostname: 'localhost',
          port: 3000,
          base: '<%= dirs.docs %>'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src_test: {
        files: '<%= jshint.src_test.src %>',
        tasks: ['jshint', 'default']
      },
      src: {
        files: ['<%= dirs.src %>/vissense.js'],
        tasks: ['jshint', 'dist']
      },
      livereload: {
        options: {livereload: true},
        files: ['<%= dirs.dist %>/vissense.js']
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    },

    jasmine: {
      coverage: {
        src: [
          '<%= dirs.src %>/<%= pkg.name %>.js'
        ],
        options: {
          display: 'full',
          summary: true,
          specs: ['spec/*Spec.js'],
          helpers: [
            'spec/*Helper.js'
          ],
          vendor: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/lodash/dist/lodash.min.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            'spec/phantomjsPolyfills.js'
          ],
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: '<%= dirs.coverage %>/coverage.json',
            thresholds: {
              lines: 95,
              statements: 90,
              branches: 90,
              functions: 100
            },
            report: [{
              type: 'lcov',
              options: {
                dir: '<%= dirs.coverage %>/lcov'
              }
            }, {
              type: 'text-summary'
            }
            ]
          }
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    micro: {
      dist: {
        src: '<%= uglify.dist.dest %>',
        options: {
          limit: 4096, // default is 5KB
          gzip: true
        }
      }
    },
    complexity: {
      generic: {
        src: ['lib/vissense.js'],
        exclude: [],
        options: {
          breakOnErrors: false,
          errorsOnly: false,
          cyclomatic: [7], // [3, 7, 12]
          halstead: [25], // [8, 13, 20]
          maintainability: 100,
          hideComplexFunctions: false,
          broadcast: false
        }
      }
    },
    coveralls: {
      options: {
        force: true
      },
      target: {
        src: '<%= dirs.coverage %>/lcov/lcov.info'
      }
    },
    jsdoc: {
      docstrap: {
        src: ['lib/**/*.js', 'README.md'],
        options: {
          destination: '<%= dirs.docs %>',
          template: 'node_modules/ink-docstrap/template',
          configure: 'jsdoc-docstrap.conf.json'
        }
      }
    },
    notify: {
      js: {
        options: {
          title: 'Javascript - <%= pkg.title %>',
          message: 'Minified and validated with success!'
        }
      },
      test: {
        options: {
          title: 'Javascript - <%= pkg.title %>',
          message: 'Tests successfully finished!'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-micro');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-umd');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-complexity');

  grunt.registerTask('dist', [
    'clean:tmp', 'clean:dist',
    'concat:tmp',
    'umd',
    'jshint',
    'complexity',
    'uglify',
    'micro',
    'clean:tmp']);

  grunt.registerTask('default', ['dist', 'test', 'notify:js']);

  grunt.registerTask('fast', ['dist', 'test-fast', 'notify:js']);

  grunt.registerTask('serve', ['dist', 'connect:server']);
  grunt.registerTask('server', ['serve']);

  grunt.registerTask('test', ['jasmine', 'karma', 'notify:test']);
  grunt.registerTask('test-fast', ['jasmine', 'notify:test']);

  grunt.registerTask('docs', ['clean:docs', 'jsdoc:docstrap', 'connect:docs']);
  grunt.registerTask('docs-only', ['clean:docs', 'jsdoc:docstrap']);

  grunt.registerTask('coverage', ['coveralls']);

};

