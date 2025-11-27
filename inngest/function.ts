import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // this the download step
    await step.sleep("wait-a-moment", "5s");

     // this trascribe call
    await step.sleep("wait-a-moment", "10s");

     // Call for summary
    await step.sleep("wait-a-moment", "10s");
    return { message: `Hello ${event.data.email}!` };
  },
);