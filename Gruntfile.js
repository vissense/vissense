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
            core: {
                src: [
                    'bower_components/visibilityjs/lib/visibility.core.js',
                    'src/main/vissense.polyfill.js',
                    'src/main/utils/vissense.utils.js',
                    'src/main/utils/vissense.utils._.js',
                    'src/main/utils/vissense.utils.addevent.js',
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
                    'src/main/monitor/vissense.monitor.js'
                ],
                dest: 'dist/vissense.monitor.js'
            },
            timer: {
                src: [
                    '<%= concat.monitor.dest %>',
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
                curly: true,
                eqeqeq: true,
                es3: true,
                forin: true,
                freeze: true,
                immed: true,
                latedef: 'nofunc',
                newcap: true,
                noarg: true,
                noempty: true,
                nonbsp: true,
                nonew: true,
                plusplus: false,
                quotmark: 'single',
                undef: true,
                unused: true,
                strict: true,
                trailing:true,
                maxparams:5,
                maxdepth: 3,
                maxcomplexity:11,
                maxlen:140,
                /* Relaxing options */
                boss: false,
                debug: false,
                eqnull: false,
                esnext: false,
                evil: false,
                expr: false,
                funcscope: false,
                globalstrict: false,
                gcl: true,
                maxerr: 10,
                sub: false,
                /* Environment options */
                node: true, /* only for Gruntfile */
                browser: true
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
    grunt.registerTask('serve', ['default', 'watch']);
    grunt.registerTask('test', ['connect', 'qunit']);
};

