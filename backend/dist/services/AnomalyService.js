"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnomalyService = void 0;
const client_1 = require("../db/client");
const ActivityService_1 = require("./ActivityService");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const env_1 = require("../config/env");
const anthropic = new sdk_1.default({
    apiKey: env_1.env.ANTHROPIC_API_KEY || 'sk-test',
});
class AnomalyService {
    static async detectAnomalies(orgId, datasetId) {
        // In a real scenario, this would compute z-scores over the dataset.
        // We simulate finding an anomaly.
        const explanation = await this.explainAnomaly("Spike in user registrations on weekend", orgId);
        const insight = await client_1.prisma.aiInsight.create({
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
    static async explainAnomaly(context, orgId) {
        if (!env_1.env.ANTHROPIC_API_KEY)
            return `Simulated explanation for anomaly: ${context}`;
        try {
            const response = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 512,
                system: "You are a data analyst explaining anomalies to a business user in plain English.",
                messages: [{ role: 'user', content: `Explain this data anomaly: ${context}` }],
            });
            const content = response.content[0];
            if (content && 'text' in content)
                return content.text;
            return "Anomaly explanation unavailable.";
        }
        catch (err) {
            console.error("Failed to explain anomaly:", err);
            return "Anomaly explanation failed due to AI service error.";
        }
    }
    static async getInsights(orgId, projectId, limit = 20) {
        const insights = await client_1.prisma.aiInsight.findMany({
            where: { organization_id: orgId, project_id: projectId, is_dismissed: false },
            orderBy: { created_at: 'desc' },
            take: limit,
        });
        return insights;
    }
    static async dismissInsight(orgId, insightId, userId) {
        const insight = await client_1.prisma.aiInsight.updateMany({
            where: { id: insightId, organization_id: orgId },
            data: { is_dismissed: true },
        });
        await ActivityService_1.ActivityService.log({
            organizationId: orgId,
            userId,
            action: 'DISMISS_INSIGHT',
            entityType: 'insight',
            entityId: insightId,
        });
        return insight.count > 0;
    }
}
exports.AnomalyService = AnomalyService;
