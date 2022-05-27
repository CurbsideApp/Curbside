export interface ApiResponse {
  "place_id": number,
  "licence": string,
  "osm_type": string,
  "osm_id": number,
  "boundingbox": string[],
  "lat": string,
  "lon": string,
  "display_name": string,
  "class": string,
  "type": string,
  "importance": number,
  "icon": string
}