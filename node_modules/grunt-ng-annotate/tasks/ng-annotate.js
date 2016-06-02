/**
 * grunt-ng-annotate
 * https://github.com/mzgol/grunt-ng-annotate
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var _ = require('lodash');
var ngAnnotate = require('ng-annotate');

module.exports = function (grunt) {

    function getPathFromTo(fromFile, toFile) {
        return path.relative(path.resolve(path.dirname(fromFile)), path.resolve(toFile))
            // URLs should have UNIX-y paths.
            .replace(/\\/g, '/');
    }

    function handleOptions(options) {
        var sourceMapOptions;

        if (!options.ngAnnotateOptions) {
            options.ngAnnotateOptions = {};
        }

        if (options.add != null) {
            options.ngAnnotateOptions.add = options.add;
            delete options.add;
        } else {
            options.ngAnnotateOptions.add = true;
        }

        if (options.remove != null) {
            options.ngAnnotateOptions.remove = options.remove;
            delete options.remove;
        } else {
            options.ngAnnotateOptions.remove = false;
        }

        if (options.regexp != null) {
            options.ngAnnotateOptions.regexp = options.regexp;
            delete options.regexp;
        }

        if (options.singleQuotes != null) {
            options.ngAnnotateOptions.single_quotes = options.singleQuotes;
            delete options.singleQuotes;
        }

        if (options.sourceMap) {
            sourceMapOptions = options.ngAnnotateOptions.sourcemap = {};
            sourceMapOptions.inline = options.sourceMap === true;
        }

        if (options.transformDest != null) {
            grunt.fail.fatal(
                [
                    'The `transformDest` option is no longer supported.',
                    'The following configuration:',
                    '',
                    '    app: {',
                    '        options: {',
                    '            transformDest: function (srcPath) {',
                    '                return doSomethingWithSrcPath(srcPath);',
                    '            },',
                    '        },',
                    '        src: [\'app/*.js\'],',
                    '    },',
                    '',
                    'should be replaced by:',
                    '',
                    '    app: {',
                    '        files: [',
                    '           {',
                    '               expand: true,',
                    '               src: [\'app/*.js\'],',
                    '               rename: function (destPath, srcPath) {',
                    '                   return doSomethingWithSrcPath(srcPath);',
                    '               },',
                    '            },',
                    '        ],',
                    '    },',
                ].join('\n')
            );
        }

        if (options.outputFileSuffix != null) {
            grunt.fail.fatal(
                [
                    'The `outputFileSuffix` option is no longer supported.',
                    'The following configuration:',
                    '',
                    '    app: {',
                    '        options: {',
                    '            outputFileSuffix: \'-annotated\',',
                    '        },',
                    '        src: [\'app/*.js\'],',
                    '    },',
                    '',
                    'should be replaced by:',
                    '',
                    '    app: {',
                    '        files: [',
                    '            {',
                    '               expand: true,',
                    '               src: [\'app/*.js\'],',
                    '               rename: function (destPath, srcPath) {',
                    '                   return srcPath + \'-annotated\';',
                    '               },',
                    '            },',
                    '        ],',
                    '    },',
                ].join('\n')
            );
        }
    }

    grunt.registerMultiTask('ngAnnotate',
        'Add, remove and rebuild AngularJS dependency injection annotations',

        function () {
            var filesNum = 0,
                validRun = true,
            // Merge task-specific and/or target-specific options with these defaults.
                options = this.options();


            handleOptions(options);

            // Iterate over all specified file groups.
            this.files.forEach(function (mapping) {
                if (!runNgAnnotate(mapping, options)) {
                    validRun = false;
                }
            });

            function runNgAnnotate(mapping, options) {
                filesNum++;

                var ngAnnotateOptions = _.cloneDeep(options.ngAnnotateOptions);

                if (ngAnnotateOptions.sourcemap) {
                    if (mapping.src.length > 1) {
                        grunt.fail.fatal('The ngAnnotate task doesn\'t support source maps with many-to-one mappings.');
                    }

                    ngAnnotateOptions.sourcemap.inFile = getPathFromTo(mapping.dest, mapping.src[0]);
                }

                var concatenatedSource = mapping.src.map(function (file) {
                    return grunt.file.read(file);
                }).join(';\n');

                var ngAnnotateOutput = ngAnnotate(concatenatedSource, ngAnnotateOptions);

                // Write the destination file.
                if (ngAnnotateOutput.errors) {
                    grunt.log.write('Generating "' + mapping.dest + '" from: "' + mapping.src.join('", "') + '"...');
                    grunt.log.error();
                    ngAnnotateOutput.errors.forEach(function (error) {
                        grunt.log.error(error);
                    });
                    return false;
                }

                // Write ngAnnotate output (and a source map if requested) to the target file.

                if (ngAnnotateOptions.sourcemap && !ngAnnotateOptions.sourcemap.inline) {
                    ngAnnotateOutput.src +=
                        '\n//# sourceMappingURL=' + getPathFromTo(mapping.dest, options.sourceMap);
                    grunt.file.write(options.sourceMap, ngAnnotateOutput.map);
                }

                grunt.file.write(mapping.dest, ngAnnotateOutput.src);

                return true;
            }

            if (validRun) {
                if (filesNum < 1) {
                    grunt.log.ok('No files provided to the ngAnnotate task.');
                } else {
                    grunt.log.ok(filesNum + (filesNum === 1 ? ' file' : ' files') + ' successfully generated.');
                }
            }
            return validRun;
        });

};
