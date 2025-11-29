import { Template, defaultBuildLogger } from 'e2b'
import { template } from './template'
import 'dotenv/config'

async function main() {
  await Template.build(template, {
    alias: 'vibe-vyank-dev',
    onBuildLogs: defaultBuildLogger(),
    apiKey: process.env.E2B_API_KEY,
  });
}

main().catch(console.error);