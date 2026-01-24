const { PrismaClient } = require('@prisma/client');
const { calculateInterviewScore } = require('../src/lib/utils');

const prisma = new PrismaClient();

async function updateLegacyScores() {
  console.log('Starting legacy score update...');

  const sessions = await prisma.session.findMany({
    where: {
      aggregateScore: null
    },
    include: {
      transcripts: true
    }
  });

  console.log(`Found ${sessions.length} sessions without scores`);

  for (const session of sessions) {
    const { score, status } = calculateInterviewScore(session.transcripts);
    await prisma.session.update({
      where: { id: session.id },
      data: {
        aggregateScore: score / 100,
        status
      }
    });
    console.log(`Updated session ${session.sessionId}: ${score}% - ${status}`);
  }

  console.log('Legacy score update completed');
  await prisma.$disconnect();
}

updateLegacyScores().catch(console.error);