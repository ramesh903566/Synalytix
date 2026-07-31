import { useState, useRef, useEffect } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { useSaveProvider, useDeleteProvider, useTestProviderConnection, useProviderInstructions, useSaveProviderInstructions } from "../../hooks/useSettings";
import { cn } from "../../lib/utils";

const PROVIDER_INFO: Record<string, { label: string; icon: string; models: string[] }> = {
  anthropic: {
    label: "Anthropic",
    icon: "🟣",
    models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307", "claude-3.5-sonnet-20241022"],
  },
  openai: {
    label: "OpenAI",
    icon: "🟢",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo", "o1-preview", "o1-mini"],
  },
  gemini: {
    label: "Google Gemini",
    icon: "🔵",
    models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-pro"],
  },
  deepseek: {
    label: "DeepSeek",
    icon: "🟠",
    models: ["deepseek-chat", "deepseek-reasoner"],
  },
  grok: {
    label: "xAI Grok",
    icon: "⚫",
    models: ["grok-2", "grok-2-mini"],
  },
};

interface ProviderCardProps {
  provider: string;
  configuredModel?: string;
  isConnected: boolean;
}

export function ProviderCard({ provider, configuredModel, isConnected }: ProviderCardProps) {
  const info = PROVIDER_INFO[provider] || { label: provider, icon: "⚪", models: [] };
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(configuredModel || info.models[0]);
  const [expanded, setExpanded] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);

  const saveProvider = useSaveProvider();
  const deleteProvider = useDeleteProvider();
  const testConnection = useTestProviderConnection();
  const { data: instructionsData } = useProviderInstructions(provider);
  const saveInstructions = useSaveProviderInstructions();

  useEffect(() => {
    if (instructionsData?.instructions) {
      setInstructions(instructionsData.instructions);
    }
  }, [instructionsData]);

  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    saveProvider.mutate(
      { provider, api_key: apiKey, model: selectedModel },
      {
        onSuccess: () => {
          setApiKey("");
          setShowKey(false);
        },
      }
    );
  };

  const handleTest = () => {
    testConnection.mutate({ provider, api_key: apiKey || "test", model: selectedModel });
  };

  const handleSaveInstructions = () => {
    saveInstructions.mutate({ provider, instructions });
  };

  const handleDelete = () => {
    // Find the provider config ID from the models list and delete it
    // For now, we'll just show a confirmation
    if (confirm(`Remove ${info.label} configuration?`)) {
      // We need the ID — for now invalidate and let the user re-add
      deleteProvider.mutate("current");
    }
  };

  const testResult = testConnection.data;

  return (
    <div className="border border-border rounded-[var(--radius-card)] bg-bg-elevated overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-[var(--radius-card-inner)] bg-bg-canvas border border-border flex items-center justify-center text-lg">
          {info.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">{info.label}</span>
            {isConnected ? (
              <Badge variant="success">Connected</Badge>
            ) : (
              <Badge variant="outline">Not configured</Badge>
            )}
          </div>
          {isConnected && configuredModel && (
            <p className="text-[10px] text-text-muted mt-0.5">
              Model: {configuredModel}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isConnected && (
            <button
              onClick={handleDelete}
              className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center text-text-muted hover:text-error hover:bg-error-light transition-colors"
              title="Remove configuration"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center text-text-secondary hover:bg-bg-sunken transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border-light p-4 space-y-4">
          {/* API Key */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1.5">
              API Key
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={isConnected ? "••••••••••••••••" : "Enter your API key"}
                  className="pr-16"
                />
                {isConnected && !showKey && (
                  <button
                    onClick={() => setShowKey(true)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-brand hover:text-brand-hover font-medium"
                  >
                    Reveal
                  </button>
                )}
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveKey}
                disabled={!apiKey.trim() || saveProvider.isPending}
              >
                {saveProvider.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
            {saveProvider.isError && (
              <p className="text-[10px] text-error mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {saveProvider.error.message}
              </p>
            )}
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1.5">
              Default Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full text-sm border border-border rounded-[var(--radius-input)] px-3 py-2 outline-none bg-bg-canvas text-text-primary cursor-pointer focus:border-brand"
            >
              {info.models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Test Connection */}
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTest}
              disabled={testConnection.isPending}
              className="gap-1.5"
            >
              {testConnection.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : testResult?.success ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : testResult && !testResult.success ? (
                <AlertCircle className="w-3.5 h-3.5 text-error" />
              ) : null}
              Test Connection
            </Button>
            {testResult && (
              <p className={cn(
                "text-[10px] mt-1.5",
                testResult.success ? "text-success" : "text-error"
              )}>
                {testResult.success
                  ? `Connected successfully (${testResult.latencyMs}ms)`
                  : `Failed: ${testResult.error}`}
              </p>
            )}
          </div>

          {/* Custom Instructions */}
          <div>
            <button
              onClick={() => setInstructionsExpanded(!instructionsExpanded)}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted hover:text-text-secondary transition-colors"
            >
              Custom Instructions
              {instructionsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {instructionsExpanded && (
              <div className="mt-2">
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Add custom instructions for this provider..."
                  rows={4}
                  maxLength={2000}
                  className="w-full text-sm p-3 border border-border rounded-[var(--radius-input)] outline-none focus:border-brand transition-all bg-bg-canvas text-text-primary resize-none"
                />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-text-muted">
                    {instructions.length}/2000
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSaveInstructions}
                    disabled={saveInstructions.isPending}
                  >
                    {saveInstructions.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      "Save Instructions"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
