import { Template, waitForPort } from 'e2b'

export const template = Template()
  .fromNodeImage('21-slim')
  .setWorkdir('/home/user')
  .runCmd('npx --yes create-next-app@15.3.3 nextjs-app --yes --ts --tailwind --no-eslint --import-alias "@/*" --use-npm')
  .setWorkdir('/home/user/nextjs-app')
  .runCmd('npx --yes shadcn@2.6.3 init --yes -d -b neutral')
  .runCmd('npx --yes shadcn@2.6.3 add --all --yes')
  .runCmd('cp -r /home/user/nextjs-app/* /home/user/nextjs-app/.[^.]* /home/user/ 2>/dev/null || true')
  .runCmd('rm -rf /home/user/nextjs-app')
  .setWorkdir('/home/user')
  .setStartCmd('npm run dev', waitForPort(3000))