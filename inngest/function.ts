import { inngest } from "./client";
import { Agent, openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const code_agent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer.You write reable, maintainale code. You write simple Next.js $ React snippests",
      model: openai({ model: "gpt-4o"}),
    });

    const { output } = await code_agent.run(
    `Summaize following text:${event.data.value}`,
    );
    console.log(output);
     
    return {output};
  },
);