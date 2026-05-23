import { prisma } from '../db/client';
import { ActivityService } from './ActivityService';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY || 'sk-test',
});

export class AnomalyService {
  static async detectAnomalies(orgId: string, datasetId: string) {
    // In a real scenario, this would compute z-scores over the dataset.
    // We simulate finding an anomaly.
    
    const explanation = await this.explainAnomaly("Spike in user registrations on weekend", orgId);

    const insight = await prisma.aiInsight.create({
      data: {
        organization_id: orgId,
        project_id: 'default', // map correctly in real app
        type: 'anomaly',
        title: 'Anomaly Detected: Registration Spike',
        description: explanation,
        confidence_score: 0.95,
        data_references: { column: 'registrations', z_score: 3.5 }
      }
    });

    return insight;
  }

  static async explainAnomaly(context: string, orgId: string) {
    if (!env.ANTHROPIC_API_KEY) return `Simulated explanation for anomaly: ${context}`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 512,
        system: "You are a data analyst explaining anomalies to a business user in plain English.",
        messages: [{ role: 'user', content: `Explain this data anomaly: ${context}` }],
      });
      const content = response.content[0];
      if (content && 'text' in content) return content.text;
      return "Anomaly explanation unavailable.";
    } catch (err) {
      console.error("Failed to explain anomaly:", err);
      return "Anomaly explanation failed due to AI service error.";
    }
  }

  static async getInsights(orgId: string, projectId: string, limit: number = 20) {
    const insights = await prisma.aiInsight.findMany({
      where: { organization_id: orgId, project_id: projectId, is_dismissed: false },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
    return insights;
  }

  static async dismissInsight(orgId: string, insightId: string, userId: string) {
    const insight = await prisma.aiInsight.updateMany({
      where: { id: insightId, organization_id: orgId },
      data: { is_dismissed: true },
    });

    await ActivityService.log({
      organizationId: orgId,
      userId,
      action: 'DISMISS_INSIGHT',
      entityType: 'insight',
      entityId: insightId,
    });

    return insight.count > 0;
  }
}
