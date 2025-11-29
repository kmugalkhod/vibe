import { inngest } from "./client";
import { Agent, openai, createAgent } from "@inngest/agent-kit";
import { Sandbox } from '@e2b/code-interpreter'
import { getSandbox } from "./utils";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event , step}) => {
    const sandboxId = await step.run("get-sandbox-id", async()=>{
      const sbx = await Sandbox.create("vibe-vyank-dev")
      return sbx.sandboxId
    })
    const code_agent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer.You write reable, maintainale code. You write simple Next.js $ React snippests",
      model: openai({ model: "gpt-4o"}),
    });

    const { output } = await code_agent.run(
    `Summaize following text:${event.data.value}`,
    );
    
    const sandboxUrl = await step.run("get-sandbox-url",async()=>{
      const sandbox = await getSandbox(sandboxId)
      const host =  sandbox.getHost(3000)

      return `https://${host}`
    })
     
    return {output,sandboxUrl};
  },
);