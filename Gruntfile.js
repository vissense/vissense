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

        dirs :{
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
                    src:  '<%= concat.tmp.dest %>',
                    dest: '<%= concat.tmp.dest %>',
                    template: './templates/umd-vissense.hbs',
                    objectToExport: 'VisSense', // optional, internal object that will be exported
                    indent: 4 // optional (defaults to 2), indent source code. Accepts strings as well
                }
            }
        },
        uglify: {
            src: {
                options: {
                    banner: '<%= banner %>',
                    drop_console: true,
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
                    banner: '<%= banner %>',
                    report: 'gzip',
                    drop_console: true,
                    sourceMap: false
                },
                src: '<%= concat.tmp.dest %>',
                dest: '<%= dirs.dist %>/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc:true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            karma: {
                src: 'karma.conf.js'
            },
            src_test: {
                src: ['tmp/**/*.js', 'spec/**/*.js']
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
                    specs: [
                        'spec/*Spec.js'
                    ],
                    helpers: [
                        'spec/*Helper.js'
                    ],
                    vendor: [
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/lodash/dist/lodash.min.js',
                        'bower_components/jasmine-jquery/lib/jasmine-jquery.js'
                    ],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: '<%= dirs.coverage %>/coverage.json',
                        report: [{
                                type: 'html',
                                options: {
                                    dir: '<%= dirs.coverage %>/html'
                                }
                            }, {
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
        connect: {
            server: {
                options: {
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
              // We watch and compile sass files as normal but don't live reload here
              files: ['<%= dirs.src %>/vissense.js'],
              tasks: ['jshint', 'dist']
            },
            livereload: {
              options: { livereload: true },
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
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        micro: {
            dist: {
              src: '<%= uglify.dist.dest %>'
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
        docular: {
            docular_webapp_target: '<%= dirs.docs %>',
            useHtml5Mode: false,
            docular_partial_home: './docs/index.html',
            docular_partial_navigation: './docs/navigation.html',
            docular_partial_footer: './docs/footer.html',
            groups: [
                {
                    groupTitle: 'VisSense',
                    groupId: 'vissense',
                    groupIcon: 'icon-code',
                    sections: [{
                        id: 'quickstart',
                        title:'Getting started',
                        docs: [
                            './docs/quickstart/index.doc'
                        ]
                    }, {
                        id: 'api',
                        title:'API',
                        scripts: [
                            '<%= dirs.src %>/vissense.js'
                        ],
                        docs: [
                            './docs/api/index.doc'
                        ]
                    }]
                }
            ]
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
    grunt.loadNpmTasks('grunt-docular');
    grunt.loadNpmTasks('grunt-umd');

    grunt.registerTask('dist', ['clean:tmp', 'concat:tmp', 'jshint', 'clean:dist', 'umd', 'uglify', 'clean:tmp']);
    grunt.registerTask('default', ['test', 'dist', 'micro', 'notify:js']);

    grunt.registerTask('serve', ['default', 'connect:server', 'watch']);
    grunt.registerTask('test', ['jasmine', 'karma', 'notify:test']);
    grunt.registerTask('docs', ['clean:docs', 'docular', 'connect:docs']);

    grunt.registerTask('coverage', ['coveralls']);


};

