export type SourceType = 'csv' | 'json' | 'api' | 'postgres' | 'mysql' | 'bigquery'

export interface Dataset {
  id:         string
  projectId:  string
  name:       string
  sourceType: SourceType
  rowCount:   number
  sizeBytes:  number
  schemaJson: Record<string, string>   // column → type
  createdAt:  string
  updatedAt:  string
}
