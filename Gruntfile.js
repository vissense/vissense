module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            '*/\n',

        // Task configuration
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: [
                    'src/core/events.js',
                    'src/core/ie.js', 
                    'src/core/visibility_styling.js', 
                    'src/core/visibility_position.js', 
                    'src/core/vissense.core.js', 
                    'src/vissense.listeners.js', 
                    'src/vissense.timers.js'
                ],
                dest: 'dist/vissense.js'
            },
            core: {
                src: [
                    'bower_components/visibilityjs/lib/visibility.core.js',
                    'src2/vissense.polyfill.js',
                    'src2/vissense.utils.js',
                    'src2/vissense.utils._.js',
                    'src2/vissense.utils.addevent.js',
                    'src2/vissense.utils.pagevisibility.js',
                    'src2/vissense.utils.elementstyling.js',
                    'src2/vissense.utils.elementposition.js',
                    'src2/vissense.utils.elementvisibility.js',
                    'src2/vissense.utils.support.js',
                    'src2/vissense.core.js',
                ],
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense2.core.js'
            },
            monitor: {
                src: [
                    '../vissense-plygrnd/app/bower_components/vissense/vissense2.core.js',
                    'src2/vissense.monitor.js'
                ],
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense2.monitor.js'
            },
            timers: {
                src: [
                    '../vissense-plygrnd/app/bower_components/vissense/vissense2.monitor.js',
                    'src2/vissense.timers.js'
                ],
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense2.timers.js'
            },
            metrics: {
                src: [
                    'bower_components/brwsrfy-metrics/dist/brwsrfy-metrics.js',
                    '../vissense-plygrnd/app/bower_components/vissense/vissense2.timers.js',
                    'src2/vissense.utils.stopwatch.js',
                    'src2/vissense.metrics.js'
                ],
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense2.metrics.js'
            },
            full: {
                src: [
                    '../vissense-plygrnd/app/bower_components/vissense/vissense2.metrics.js',
                    'src2/vissense.client.js'
                ],
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense2.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/vissense.min.js'
            },

            full: {
                src: '../vissense-plygrnd/app/bower_components/vissense/vissense2.js',
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense2.min.js'
            },
            core: {
                src: '../vissense-plygrnd/app/bower_components/vissense/vissense2.core.js',
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense2.core.min.js'
            },
            monitor: {
                src: '../vissense-plygrnd/app/bower_components/vissense/vissense2.monitor.js',
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense2.monitor.min.js'
            },
            timers: {
                src: '../vissense-plygrnd/app/bower_components/vissense/vissense2.timers.js',
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense2.timers.min.js'
            },
            metrics: {
                src: '../vissense-plygrnd/app/bower_components/vissense/vissense2.metrics.js',
                dest: '../vissense-plygrnd/app/bower_components/vissense/vissense2.metrics.min.js'
            }
        },
        jshint: {
            options: {
                node: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                eqnull: true,
                browser: true,
                globals: {
                    Window: true,
                    HTMLDocument: true,
                    Element: true,
                    Event: true,
                    jQuery: false 
                },
                boss: true
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
                'test/**/*.html'
            ]
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
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');


    // Default task
    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'test']);
    grunt.registerTask('serve', ['default', 'connect','watch']);
    grunt.registerTask('test', ['qunit']);
};

