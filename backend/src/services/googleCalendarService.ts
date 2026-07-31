import { google, calendar_v3 } from 'googleapis';

export class GoogleCalendarService {
  static getOAuth2Client() {
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/callback/google-calendar`
    );
  }

  static getAuthUrl(state: string) {
    const oauth2Client = this.getOAuth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      state: state
    });
  }

  static async getTokens(code: string): Promise<{ access_token?: string | null; refresh_token?: string | null; expiry_date?: number | null; scope?: string }> {
    const oauth2Client = this.getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }

  static async getEvents(accessToken: string, refreshToken: string | null) {
    const oauth2Client = this.getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Get events for the current month +/- 1 month (to cover the calendar grid)
    const now = new Date();
    const timeMin = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const timeMax = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin,
      timeMax: timeMax,
      maxResults: 250,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  }
}
