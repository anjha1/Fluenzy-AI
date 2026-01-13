import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await request.json();

    const user = await prisma.users.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const sessionData = await (prisma as any).session.findFirst({
      where: {
        sessionId,
        userId: user.id
      },
      include: {
        transcripts: {
          orderBy: { turnNumber: 'asc' }
        }
      }
    });

    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Generate HTML for PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ACEVOICE AI PERFORMANCE REPORT - ${sessionData.sessionId}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Inter', sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 10pt; line-height: 1.6; }
            .header { border-bottom: 3px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title { font-size: 22pt; font-weight: 900; letter-spacing: -0.02em; text-transform: uppercase; }
            .meta { font-size: 8pt; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }
            .section { margin-bottom: 40px; page-break-inside: avoid; }
            .section-title { font-size: 14pt; font-weight: 900; background: #f8fafc; padding: 10px 15px; border-left: 6px solid #0f172a; margin-bottom: 20px; text-transform: uppercase; }
            .turn { margin-bottom: 20px; padding: 15px; border-radius: 8px; border: 1px solid #f1f5f9; }
            .label { font-size: 7pt; font-weight: 900; text-transform: uppercase; margin-bottom: 5px; display: block; }
            .label.ai { color: #2563eb; }
            .label.user { color: #64748b; }
            .bubble { padding: 10px; border-radius: 6px; }
            .bubble.ai { background: #eff6ff; color: #1e40af; border: 1px solid #dbeafe; font-weight: 600; }
            .bubble.user { background: #f8fafc; color: #334155; }
            .footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 7pt; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 10px; }
            .scores { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .score-item { text-align: center; }
            .score-value { font-size: 18pt; font-weight: 900; }
            .score-label { font-size: 8pt; font-weight: 700; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">ACEVOICE AI PERFORMANCE REPORT</div>
              <div class="meta">SESSION ARCHIVE: ${sessionData.sessionId}</div>
            </div>
            <div class="meta" style="text-align: right;">
              DATE: ${sessionData.startTime.toLocaleDateString()}<br/>
              SCORE: ${Math.round((sessionData.aggregateScore || 0) * 10)}%
            </div>
          </div>

          <div class="section">
            <div class="section-title">1. EXECUTIVE SUMMARY</div>
            <p><strong>Candidate Name:</strong> ${user.name}</p>
            <p><strong>Target Company:</strong> ${sessionData.targetCompany || 'N/A'}</p>
            <p><strong>Role:</strong> ${sessionData.role || 'N/A'}</p>
            <p><strong>Date:</strong> ${sessionData.startTime.toLocaleDateString()}</p>
            <p><strong>Aggregate Score:</strong> ${Math.round((sessionData.aggregateScore || 0) * 10)}%</p>
            <p><strong>Final Status:</strong> ${sessionData.status}</p>
          </div>

          <div class="section">
            <div class="section-title">2. FULL CONVERSATION ARCHIVE</div>
            ${sessionData.transcripts.map((t: any, i: number) => `
              <div class="turn">
                <span class="label ai">AI PROMPT:</span>
                <div class="bubble ai">"${t.aiPrompt}"</div>
                <span class="label user">USER CAPTURED ANSWER (RAW):</span>
                <div class="bubble user">"${t.userAnswer}"</div>
                <span class="label ai">HOW TO ANSWER PROFESSIONALLY:</span>
                <div class="bubble ai">"${t.idealAnswer}"</div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="section-title">3. PERFORMANCE BREAKDOWN</div>
            <div class="scores">
              <div class="score-item">
                <div class="score-value">${sessionData.transcripts.reduce((sum: number, t: any) => sum + (t.clarityScore || 0), 0) / sessionData.transcripts.length || 0}/10</div>
                <div class="score-label">Communication</div>
              </div>
              <div class="score-item">
                <div class="score-value">${sessionData.transcripts.reduce((sum: number, t: any) => sum + (t.confidenceScore || 0), 0) / sessionData.transcripts.length || 0}/10</div>
                <div class="score-label">Confidence</div>
              </div>
              <div class="score-item">
                <div class="score-value">${sessionData.transcripts.reduce((sum: number, t: any) => sum + (t.grammarScore || 0), 0) / sessionData.transcripts.length || 0}/10</div>
                <div class="score-label">Grammar</div>
              </div>
              <div class="score-item">
                <div class="score-value">${sessionData.transcripts.reduce((sum: number, t: any) => sum + (t.technicalAccuracyScore || 0), 0) / sessionData.transcripts.length || 0}/10</div>
                <div class="score-label">Technical Knowledge</div>
              </div>
              <div class="score-item">
                <div class="score-value">${Math.round((sessionData.aggregateScore || 0) * 10)}%</div>
                <div class="score-label">Overall Rating</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">4. SYSTEM VERDICT</div>
            <p>Based on the performance analysis, the candidate ${sessionData.status === 'PASS' ? 'demonstrates strong potential and is recommended for further consideration.' : 'requires additional preparation before proceeding with interviews.'}</p>
          </div>

          <div class="footer">ACEVOICE AI – CONFIDENTIAL CAREER ARCHIVE | https://pixora-ai-ojzx.onrender.com/</div>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}