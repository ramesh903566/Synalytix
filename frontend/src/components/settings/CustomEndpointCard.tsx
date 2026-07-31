import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useSaveProvider, useTestProviderConnection } from "../../hooks/useSettings";
import { cn } from "../../lib/utils";

export function CustomEndpointCard() {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");

  const saveProvider = useSaveProvider();
  const testConnection = useTestProviderConnection();

  const handleSave = () => {
    if (!name.trim() || !baseUrl.trim() || !apiKey.trim() || !model.trim()) return;
    saveProvider.mutate(
      { provider: "openai", api_key: apiKey, model, base_url: baseUrl },
      {
        onSuccess: () => {
          setName("");
          setBaseUrl("");
          setApiKey("");
          setModel("");
          setExpanded(false);
        },
      }
    );
  };

  const handleTest = () => {
    if (!apiKey.trim() || !model.trim()) return;
    testConnection.mutate({ provider: "openai", api_key: apiKey, model, base_url: baseUrl || undefined });
  };

  const testResult = testConnection.data;

  return (
    <div className="border border-dashed border-border rounded-[var(--radius-card)] bg-bg-elevated overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-bg-sunken/30 transition-colors"
      >
        <div className="w-10 h-10 rounded-[var(--radius-card-inner)] bg-bg-sunken border border-border flex items-center justify-center">
          <span className="text-lg">🔗</span>
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-text-primary">Custom Endpoint</span>
          <p className="text-[10px] text-text-muted">OpenAI-compatible API</p>
        </div>
        <Badge variant="outline">Add</Badge>
        {expanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
      </button>

      {expanded && (
        <div className="border-t border-border-light p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My Local LLM"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">
                Base URL
              </label>
              <Input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com/v1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">
                API Key
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">
                Model
              </label>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., llama-3.1-70b"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTest}
              disabled={!apiKey.trim() || !model.trim() || testConnection.isPending}
            >
              {testConnection.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : null}
              Test
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={!name.trim() || !baseUrl.trim() || !apiKey.trim() || !model.trim() || saveProvider.isPending}
            >
              {saveProvider.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Save Endpoint"
              )}
            </Button>
            {testResult && (
              <span className={cn(
                "text-[10px]",
                testResult.success ? "text-success" : "text-error"
              )}>
                {testResult.success ? `OK (${testResult.latencyMs}ms)` : testResult.error}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
