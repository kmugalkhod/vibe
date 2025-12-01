import { inngest } from "./client";
import { Agent, openai,anthropic, createAgent, createTool, createNetwork } from "@inngest/agent-kit";
import { Sandbox } from '@e2b/code-interpreter'
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import * as z from "zod"; 
import {PROMPT} from "../prompt"
import { title } from "process";
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
      description: "An Expert coding agent",
      system: PROMPT,
      model:openai({
        model: "gpt-4.1",
        defaultParameters: { temperature: 0.1},

      }),
      tools:[
        createTool({
          name : "Terminal",
          description : "Use the terminal to run the commands",
          parameters: z.object({
            command: z.string()
          }),
          handler : async({command}, {step})=>{
            return await step?.run("terminal", async()=>{
              const buffers = { stdout: "", stderr: "" }
               try {
                  const sandbox = await getSandbox(sandboxId);
                  const result = await sandbox.commands.run(command, {
                    onStdout: (data: string) => {
                      buffers.stdout += data;
                    },
                    onStderr: (data: string) => {
                      buffers.stderr += data;
                    },
                  });
                  return result.stdout;
                } catch (e) {
                  console.error(
                    `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
                  );
                  return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
                }
            })
          }

        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
        handler: async ({ files }, { step,network }) => {
            const newfiles = await step?.run("terminal", async()=>{

              const updatefiles = network.state.data.files || {}
              try {
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatefiles[file.path] = file.content
                }
                return updatefiles;
              } catch (e) {
                return "Error: " + e;
              }

            })

            if(typeof newfiles ==="object"){
              network.state.data.files = newfiles
            }

          }
        }),
        createTool({
          name: "readFiles",
          description: "read files in the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readfiles", async()=>{
              try{
                const sandbox = await getSandbox(sandboxId)
                const contents = [] 
                for (const file of files) {
                  const content = await sandbox.files.read(file)
                  contents.push({path: file,content})
                }
                return JSON.stringify(contents)
              }
              catch(e){
                return "Error: " + e;
              }
            })
          }
        })
      ],
      lifecycle : {
        onResponse: async({result,network})=>{
          const lastAssistantTextMessageText = lastAssistantTextMessageContent(result)

          if (lastAssistantTextMessageText && network) {
            if(lastAssistantTextMessageText.includes("<task_summary>")){
              network.state.data.summary = lastAssistantTextMessageText
            }
          }
          return result
        } 
      }
    });

    const network = createNetwork({
      name: "coding-agent-network",
      agents: [code_agent],
      maxIter: 15,
      router: async({network})=>{
        const summary = network.state.data.summary

        if(summary){
          return
        }

        return code_agent
      }

    })

    const result = await network.run(event.data.value)
    
    const sandboxUrl = await step.run("get-sandbox-url",async()=>{
      const sandbox = await getSandbox(sandboxId)
      const host =  sandbox.getHost(3000)

      return `https://${host}`
    })
     
    return {
      url:sandboxUrl,
      title : "Fragment",
      files : result.state.data.files,
      summary : result.state.data.summary
    };
  },
);