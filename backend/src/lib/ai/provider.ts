import Anthropic from "@anthropic-ai/sdk";
import { AIOutputSchema, type AIOutput } from "../../types/recommendations";

export interface AIProviderConfig {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

export interface AIProviderAdapter {
  name: string;
  analyzeAccounts(
    userId: string,
    providerConfig: AIProviderConfig,
    instructions: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<AIOutput>;
}

// ─── Base Adapter for Retry Logic ─────────────────────────────────────────────

abstract class BaseAIAdapter implements AIProviderAdapter {
  abstract name: string;
  protected abstract complete(system: string, user: string, config: AIProviderConfig): Promise<string>;

  protected getJsonInstructions(): string {
    return `
STRICT RULES FOR OUTPUT:
1. Return ONLY a valid JSON object matching the requested schema.
2. No markdown code blocks (e.g. \`\`\`json), no preamble, no trailing text.
3. The 'reasoning' field MUST cite specific data points from the user's account data. Do not provide generic advice.
4. 'estimated_time' MUST be realistic based on the user's current activity velocity shown in the data.
`;
  }

  async analyzeAccounts(
    userId: string,
    providerConfig: AIProviderConfig,
    instructions: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<AIOutput> {
    const finalSystemPrompt = `${systemPrompt}\n\n${instructions}\n\n${this.getJsonInstructions()}`;

    let rawResponse = await this.complete(finalSystemPrompt, userPrompt, providerConfig);
    
    try {
      return this.parseAndValidate(rawResponse);
    } catch (err) {
      // Retry once with correction
      const errorMessage = err instanceof Error ? err.message : String(err);
      const correctionPrompt = `The previous response failed schema validation. Return ONLY valid JSON that conforms to the schema. Errors:\n${errorMessage}`;
      
      const retryUserPrompt = `${userPrompt}\n\nPrevious response:\n${rawResponse}\n\n${correctionPrompt}`;
      rawResponse = await this.complete(finalSystemPrompt, retryUserPrompt, providerConfig);
      
      try {
        return this.parseAndValidate(rawResponse);
      } catch (retryErr) {
        throw new Error(`AI Provider ${this.name} failed to return valid structured output after retry. ${retryErr}`);
      }
    }
  }

  private parseAndValidate(rawJson: string): AIOutput {
    const cleaned = rawJson
      .replace(/^```json/mi, "")
      .replace(/^```/mi, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    return AIOutputSchema.parse(parsed);
  }
}

// ─── Anthropic Provider ───────────────────────────────────────────────────────

export class AnthropicProvider extends BaseAIAdapter {
  name = "anthropic";

  protected async complete(system: string, user: string, config: AIProviderConfig): Promise<string> {
    const client = new Anthropic({ apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY! });
    const response = await client.messages.create({
      model: config.model || "claude-3-opus-20240229",
      max_tokens: Number(process.env.AI_MAX_TOKENS ?? 4000),
      temperature: Number(process.env.AI_TEMPERATURE ?? 0.4),
      system: system,
      messages: [{ role: "user", content: user }],
    });

    const block = response.content[0];
    if (block.type !== "text") throw new Error("Unexpected Anthropic response type");
    return block.text;
  }
}

// ─── OpenAI-Compatible Provider (OpenAI, DeepSeek, Grok) ──────────────────────

export class OpenAICompatibleProvider extends BaseAIAdapter {
  name = "openai";

  protected async complete(system: string, user: string, config: AIProviderConfig): Promise<string> {
    const apiKey = config.apiKey || process.env.OPENAI_API_KEY!;
    const baseUrl = config.baseUrl || "https://api.openai.com/v1";
    
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: config.model || "gpt-4o",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        temperature: Number(process.env.AI_TEMPERATURE ?? 0.4),
        response_format: { type: "json_object" }
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.statusText}`);
    }

    const data = (await res.json()) as any;
    return data.choices[0].message.content;
  }
}

// ─── Gemini Provider ──────────────────────────────────────────────────────────

export class GeminiProvider extends BaseAIAdapter {
  name = "gemini";

  protected async complete(system: string, user: string, config: AIProviderConfig): Promise<string> {
    const apiKey = config.apiKey || process.env.GEMINI_API_KEY!;
    const model = config.model || "gemini-1.5-pro";
    
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `SYSTEM: ${system}\n\nUSER: ${user}` }] }
        ],
        generationConfig: {
          temperature: Number(process.env.AI_TEMPERATURE ?? 0.4),
          responseMimeType: "application/json"
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.statusText}`);
    }

    const data = (await res.json()) as any;
    return data.candidates[0].content.parts[0].text;
  }
}

// ─── Provider Registry & Fallback Chain ───────────────────────────────────────

export class ProviderRegistry {
  private adapters: Map<string, AIProviderAdapter> = new Map();

  constructor() {
    this.register(new AnthropicProvider());
    this.register(new OpenAICompatibleProvider());
    this.register(new GeminiProvider());
  }

  register(adapter: AIProviderAdapter) {
    this.adapters.set(adapter.name, adapter);
  }

  getAdapter(name: string): AIProviderAdapter {
    const adapter = this.adapters.get(name);
    if (!adapter) throw new Error(`Unknown provider: ${name}`);
    return adapter;
  }

  async executeWithFallback(
    userId: string,
    providers: { name: string; config: AIProviderConfig }[],
    instructions: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<{ output: AIOutput, providerUsed: string }> {
    let lastError: Error | null = null;

    for (const provider of providers) {
      try {
        const adapter = this.getAdapter(provider.name);
        const output = await adapter.analyzeAccounts(userId, provider.config, instructions, systemPrompt, userPrompt);
        return { output, providerUsed: provider.name };
      } catch (err) {
        lastError = err as Error;
        console.warn(`Provider ${provider.name} failed. Failing over... Error: ${lastError.message}`);
        // Continue to next provider in fallback chain
      }
    }

    throw new Error(`All providers in fallback chain failed. Last error: ${lastError?.message}`);
  }
}

export const providerRegistry = new ProviderRegistry();
