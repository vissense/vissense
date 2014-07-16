module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            '*/\n',
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
                    '<%= concat.timer.dest %>',
                    'src/main/utils/vissense.utils.stopwatch.js',
                    'src/main/metrics/vissense.metrics.js'
                ],
                dest: 'dist/vissense.metrics.js'
            },
            dist: {
                src: [
                    '<%= concat.metrics.dest %>',
                    'src/main/plugins/percentage_time_test/vissense.plugins.percentage_time_test.js',
                    'src/main/plugins/percentage_time_test/vissense.plugins.50_1_test.js',
                    'src/main/utils/vissense.utils.addevent.js',
                    'src/main/client/vissense.client.js'
                ],
                dest: 'dist/vissense.js'
            },
            'copy-to-playground': {
                src: ['<%= concat.dist.dest %>'],
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense.js'
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
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/vissense.min.js'
            },
            'copy-to-playground': {
                src: '<%= concat.dist.dest %>',
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc:true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src_test: {
                src: ['src/**/*.js', 'test/**/*.js']
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
                    specs: 'spec/*Spec.js',
                    helpers: 'spec/*Helper.js'
                }
            },
            coverage: {
                src: ['dist/vissense.js'],
                options: {
                    specs: ['spec/*Spec.js'],
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

    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-karma');

    grunt.loadNpmTasks('grunt-notify');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'test', 'notify:js']);
    grunt.registerTask('serve', ['default', 'watch']);
    grunt.registerTask('test', ['connect', 'jasmine', 'karma', 'qunit', 'notify:test']);
};

