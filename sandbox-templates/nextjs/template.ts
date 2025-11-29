import { Template, waitForURL } from 'e2b'

export const template = Template()
  .fromNodeImage('21')
  .setWorkdir('/home/user/nextjs-app')
  .runCmd('npx --yes create-next-app@15.3.3 . --yes')
  .runCmd('npx --yes shadcn@2.6.3 init --yes -b neutral --force')
  .runCmd('npx --yes shadcn@2.6.3 add --all --yes')
  .runCmd('mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app')
  .setWorkdir('/home/user')
  .setStartCmd('npx next dev --turbopack', waitForURL('http://localhost:3000'))