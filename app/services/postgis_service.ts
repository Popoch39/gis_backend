import Feature from '#models/feature'
import { GeoJSON, GeometryType } from '../types/postgisTypes.js'
import db from '@adonisjs/lucid/services/db'
import wellknown from 'wellknown'

export class PostgisUtils {

  /**
   * Convertit un objet GeoJSON en géométrie PostGIS
   */
  static async geoJsonToPostgis(geojson: wellknown.GeoJSONGeometry | wellknown.GeoJSONFeature) {
    if (!geojson || typeof geojson !== 'object') {
      throw new Error('GeoJSON invalide')
    }

    const stringifiedGeom = wellknown.stringify(geojson);
    return stringifiedGeom;
  }

  /**
  * Détermine le type de géométrie d'un GeoJSON
  */
  static getGeometryType(geojson: wellknown.GeoJSONFeature): string {
    if (!geojson || !geojson.type) {
      throw new Error('GeoJSON sans type spécifié')
    }
    return geojson.geometry.type;
  }


  /**
  * Vérifie si un objet est un GeoJSON valide
  */
  static isValidGeoJson(geojson: GeoJSON): boolean {
    if (!geojson || typeof geojson !== 'object' || !geojson.type) {
      return false
    }

    // get values from enum
    const validTypes = Object.values(GeometryType);

    return validTypes.includes(geojson.type)
  }

}
