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
            coverage: '<%= dirs.dist %>/coverage'
        },
        clean: {
          tmp: {
            src: ['<%= dirs.tmp %>']
          },
          dist: {
            src: ['<%= dirs.dist %>']
          }
        },
        concat: {
            tmp: {
                options: {
                    banner: ';(function(window, Math, Visibility, undefined) {\n\'use strict\';\n',
                    footer: '\n})(window, Math, window.Visibility || null, undefined);',
                    stripBanners: true
                },
                src: [
                    'src/main/utils/vissense.utils.js',
                    'src/main/core/vissense.core.js'
                ],
                dest: '<%= dirs.tmp %>/<%= pkg.name %>.js'
            },
            dist: {
                options: {
                  banner: '<%= banner %>',
                  stripBanners: true
                },
                src: '<%= concat.tmp.dest %>',
                dest: '<%= dirs.dist %>/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                report: 'gzip',
                drop_console: true,
                sourceMap: true,
                sourceMapName: '<%= uglify.dist.dest %>.map'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
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
        qunit: {
            files: [
                'src/test/**/*.html'
            ]
        },

        jasmine: {
            coverage: {
                src: [
                    'src/main/utils/vissense.utils.js',
                    'src/main/core/vissense.core.js'
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
                        'bower_components/visibilityjs/lib/visibility.core.js'
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
                    base: './'
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
                tasks: ['jshint:src_test', 'default']
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'release v%VERSION%',
                commitFiles: ['package.json', 'bower.json'],
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
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-notify');

    grunt.registerTask('dist', ['clean:tmp', 'concat:tmp', 'jshint', 'clean:dist', 'concat:dist', 'uglify', 'clean:tmp']);
    grunt.registerTask('default', ['dist', 'test', 'notify:js']);

    grunt.registerTask('serve', ['default', 'watch']);
    grunt.registerTask('test', ['connect', 'jasmine', 'karma', /*'qunit',*/ 'notify:test']);
};

