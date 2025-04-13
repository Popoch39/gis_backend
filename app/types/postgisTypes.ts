export enum GeometryType {
  POINT = 'Point',
  LINESTRING = 'LineString',
  POLYGON = 'Polygon',
  MULTIPOINT = 'MultiPoint',
  MULTILINESTRING = 'MultiLineString',
  MULTIPOLYGON = 'MultiPolygon',
  GEOMETRYCOLLECTION = 'GeometryCollection',
  FEATURE = 'Feature',
  FEATURECOLLECTION = 'FeatureCollection'
}

export type Position = [number, number] | [number, number, number];

export interface Point {
  type: GeometryType.POINT;
  coordinates: Position;
}

export interface LineString {
  type: GeometryType.LINESTRING;
  coordinates: Position[];
}

export interface Polygon {
  type: GeometryType.POLYGON;
  coordinates: Position[][];
}

export interface MultiPoint {
  type: GeometryType.MULTIPOINT;
  coordinates: Position[];
}

export interface MultiLineString {
  type: GeometryType.MULTILINESTRING;
  coordinates: Position[][];
}

export interface MultiPolygon {
  type: GeometryType.MULTIPOLYGON;
  coordinates: Position[][][];
}

export interface GeometryCollection {
  type: GeometryType.GEOMETRYCOLLECTION;
  geometries: Geometry[];
}

export type Geometry = Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon | GeometryCollection;

export interface Feature<G = Geometry, P = any> {
  type: GeometryType.FEATURE;
  geometry: G;
  properties: P;
  id?: string | number;
}

export interface FeatureCollection<G = Geometry, P = any> {
  type: GeometryType.FEATURECOLLECTION;
  features: Array<Feature<G, P>>;
}

export type GeoJSON = Feature | FeatureCollection;
