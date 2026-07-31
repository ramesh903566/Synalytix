import { Loader2 } from "lucide-react";
import { ProviderCard } from "./ProviderCard";
import { CustomEndpointCard } from "./CustomEndpointCard";
import { useAIProviders } from "../../hooks/useSettings";

const PROVIDERS = ["anthropic", "openai", "gemini", "deepseek", "grok"];

export function AIProvidersTab() {
  const { data: models, isLoading } = useAIProviders();

  // Build a map of which providers are configured
  const configured = (models || []).reduce(
    (acc, m) => {
      if (!acc[m.provider]) acc[m.provider] = { connected: false, model: "" };
      acc[m.provider].connected = true;
      acc[m.provider].model = m.model;
      return acc;
    },
    {} as Record<string, { connected: boolean; model: string }>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-bg-sunken animate-pulse rounded-[var(--radius-card)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-1">AI Providers</h2>
        <p className="text-xs text-text-muted">
          Configure API keys for AI providers. Your keys are encrypted and stored securely.
        </p>
      </div>

      <div className="space-y-3">
        {PROVIDERS.map((provider) => (
          <ProviderCard
            key={provider}
            provider={provider}
            configuredModel={configured[provider]?.model}
            isConnected={configured[provider]?.connected || false}
          />
        ))}
        <CustomEndpointCard />
      </div>
    </div>
  );
}
