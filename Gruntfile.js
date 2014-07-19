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
            coverage: './bin/coverage'
        },

        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            core: {
                src: [
                    'bower_components/visibilityjs/lib/visibility.core.js',
                    'src/main/vissense.polyfill.js',
                    'src/main/utils/vissense.utils.js',
                    'src/main/utils/vissense.utils._.js',
                    'src/main/utils/vissense.utils.pagevisibility.js',
                    'src/main/utils/vissense.utils.elementstyling.js',
                    'src/main/utils/vissense.utils.elementposition.js',
                    'src/main/utils/vissense.utils.elementvisibility.js',
                    'src/main/utils/vissense.utils.support.js',
                    'src/main/core/vissense.core.js'
                ],
                dest: 'dist/vissense.core.js'
            },
            monitor: {
                src: [
                    '<%= concat.core.dest %>',
                    'src/main/monitor/vissense.monitor.state.js',
                    'src/main/monitor/vissense.monitor.js'
                ],
                dest: 'dist/vissense.monitor.js'
            },
            timer: {
                src: [
                    '<%= concat.monitor.dest %>',
                    'bower_components/againjs/dist/againjs.min.js',
                    'src/main/timer/vissense.timer.js'
                ],
                dest: 'dist/vissense.timer.js'
            },
            metrics: {
                src: [
                    'bower_components/brwsrfy-metrics/dist/brwsrfy-metrics.js',
                    'bower_components/countonmejs/dist/countonmejs.min.js',
                    '<%= concat.timer.dest %>',
                    'src/main/metrics/vissense.metrics.js'
                ],
                dest: 'dist/vissense.metrics.js'
            },
            client: {
                src: [
                    'bower_components/happeningsjs/dist/happeningsjs.min.js',
                    '<%= concat.metrics.dest %>',
                    'src/main/plugins/percentage_time_test/vissense.plugins.percentage_time_test.js',
                    'src/main/plugins/percentage_time_test/vissense.plugins.50_1_test.js',
                    'src/main/client/vissense.client.js'
                ],
                dest: 'dist/vissense.client.js'
            },
            dist: {
                src: [
                    '<%= concat.client.dest %>'
                ],
                dest: 'dist/vissense.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            core: {
                src: '<%= concat.core.dest %>',
                dest: 'dist/vissense.core.min.js'
            },
            monitor: {
                src: '<%= concat.monitor.dest %>',
                dest: 'dist/vissense.monitor.min.js'
            },
            timer: {
                src: '<%= concat.timer.dest %>',
                dest: 'dist/vissense.timer.min.js'
            },
            metrics: {
                src: '<%= concat.metrics.dest %>',
                dest: 'dist/vissense.metrics.min.js'
            },
            client: {
                src: '<%= concat.client.dest %>',
                dest: 'dist/vissense.client.min.js'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/vissense.min.js'
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
                src: ['src/**/*.js', 'spec/**/*.js']
            }
        },
        qunit: {
            files: [
                'src/test/**/*.html'
            ]
        },

        jasmine: {
            js: {
                src: 'dist/vissense.js',
                options: {
                    display: 'full',
                    summary: true,
                    specs: ['spec/*Spec.js'],
                    helpers: [
                        'spec/*Helper.js'
                    ],
                    vendor: [
                        './bower_components/jquery/dist/jquery.min.js',
                        './bower_components/lodash/dist/lodash.min.js',
                        './bower_components/jasmine-jquery/lib/jasmine-jquery.js'
                    ]
                }
            },
            coverage: {
                src: ['dist/vissense.js'],
                options: {
                    specs: ['spec/*Spec.js'],
                    helpers: [
                        'spec/*Helper.js'
                    ],
                    vendor: [
                        './bower_components/jquery/dist/jquery.min.js',
                        './bower_components/lodash/dist/lodash.min.js',
                        './bower_components/jasmine-jquery/lib/jasmine-jquery.js'
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
                                type: 'cobertura',
                                options: {
                                    dir: '<%= dirs.coverage %>/cobertura'
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
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-karma');

    grunt.loadNpmTasks('grunt-notify');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'test', 'notify:js']);

    grunt.registerTask('serve', ['default', 'watch']);
    grunt.registerTask('test', ['connect', 'jasmine', 'karma', 'qunit', 'notify:test']);
};

