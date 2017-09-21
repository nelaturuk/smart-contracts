/*globals define*/
/*jshint node:true, browser:true*/

/**
 * Generated by PluginGenerator 1.7.0 from webgme on Wed Sep 20 2017 23:32:57 GMT-0500 (CDT).
 * A plugin that inherits from the PluginBase. To see source code documentation about available
 * properties and methods visit %host%/docs/source/PluginBase.html.
 */

define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase',
    'q',
    'common/util/ejs'
], function (
    PluginConfig,
    pluginMetadata,
    PluginBase,
    Q,
    ejs) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);

    /**
     * Initializes a new instance of SolidityCodeGenerator.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin SolidityCodeGenerator.
     * @constructor
     */
    var SolidityCodeGenerator = function () {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    };

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructue etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    SolidityCodeGenerator.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    SolidityCodeGenerator.prototype = Object.create(PluginBase.prototype);
    SolidityCodeGenerator.prototype.constructor = SolidityCodeGenerator;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(string, plugin.PluginResult)} callback - the result callback
     */
    SolidityCodeGenerator.prototype.main = function (callback) {
        // Use self to access core, project, result, logger etc from PluginBase.
        // These are all instantiated at this point.
        var self = this,
          nodes,
          artifact;

        self.loadNodeMap(self.activeNode)
           .then(function (nodes_) {
            nodes = nodes_;

            return SolidityCodeGenerator.getGeneratedFile(self, nodes);
        })
        .then(function (result) {
            if (result.violations.length > 0) {
                result.violations.forEach(function (violation) {
                    self.createMessage(violation.node, violation.message, 'error');
                });
                throw new Error('Model has ' + result.violations.length + ' violation(s). ' +
                'See messages for details.');
            }

            artifact = self.blobClient.createArtifact('SolidityContract');
            return artifact.addFiles(result.fileContent);
        })
        .then(function (fileHash) {
            self.result.addArtifact(fileHash);
            return artifact.save();
        })
        .then(function () {
            self.result.setSuccess(true);
            callback(null, self.result);
        })
        .catch(function (err) {
            self.logger.error(err.stack);
            // Result success is false at invocation.
            callback(err, self.result);
        });
    };

    /**
     *
     * @param {PluginBase} self - An initialized and configured plugin.
     * @param {Object<string, Object>} nodes - all nodes loaded from the projectNode.
     * @param {object} activeNode - the projectNode.
     *
     * @returns {fileContent: string, violations: Objects[]}
     */
    SolidityCodeGenerator.getGeneratedFile = function (self, nodes, callback) {


    };



    return SolidityCodeGenerator;
});