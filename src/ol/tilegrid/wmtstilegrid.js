goog.provide('ol.tilegrid.WMTS');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('ol.proj');
goog.require('ol.tilegrid.TileGrid');



/**
 * @constructor
 * @extends {ol.tilegrid.TileGrid}
 * @param {ol.tilegrid.WMTSOptions} options WMTS options.
 */
ol.tilegrid.WMTS = function(options) {

  goog.asserts.assert(
      options.resolutions.length == options.matrixIds.length);

  /**
   * @private
   * @type {!Array.<string>}
   */
  this.matrixIds_ = options.matrixIds;
  // FIXME: should the matrixIds become optionnal?

  goog.base(this, {
    origin: options.origin,
    origins: options.origins,
    resolutions: options.resolutions,
    tileSize: options.tileSize,
    tileSizes: options.tileSizes
  });

};
goog.inherits(ol.tilegrid.WMTS, ol.tilegrid.TileGrid);


/**
 * @param {number} z Z.
 * @return {string} MatrixId..
 */
ol.tilegrid.WMTS.prototype.getMatrixId = function(z) {
  goog.asserts.assert(0 <= z && z < this.matrixIds_.length);
  return this.matrixIds_[z];
};


/**
 * @return {Array.<string>} MatrixIds.
 */
ol.tilegrid.WMTS.prototype.getMatrixIds = function() {
  return this.matrixIds_;
};


/**
 * @param {Object} matrixSet An object representing a matrixSet in the
 *     capabilities document.
 * @return {ol.tilegrid.WMTS} WMTS tileGrid instance.
 */
ol.tilegrid.WMTS.createFromCapabilitiesMatrixSet =
    function(matrixSet) {

  var resolutions = [];
  var matrixIds = [];
  var origins = [];
  var tileSizes = [];
  var projection = ol.proj.get(matrixSet['supportedCRS']);
  var metersPerUnit = projection.getMetersPerUnit();
  goog.array.forEach(matrixSet['matrixIds'], function(elt, index, array) {
    matrixIds.push(elt['identifier']);
    origins.push(elt['topLeftCorner']);
    resolutions.push(elt['scaleDenominator'] * 0.28E-3 / metersPerUnit);
    tileSizes.push([elt['tileWidth'], elt['tileHeight']]);
  });

  return new ol.tilegrid.WMTS({
    origins: origins,
    resolutions: resolutions,
    matrixIds: matrixIds,
    tileSizes: tileSizes
  });
};
