-- Create GIN indexes for JSONB columns
CREATE INDEX datasets_schema_json_gin ON datasets USING GIN (schema_json);
CREATE INDEX dashboards_layout_json_gin ON dashboards USING GIN (layout_json);
CREATE INDEX widgets_config_json_gin ON widgets USING GIN (config_json);
