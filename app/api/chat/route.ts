import { NextRequest } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.
 
Current conversation:
{chat_history}
 
User: {input}
AI:`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = body.messages ?? [];
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content;

  const prompt = PromptTemplate.fromTemplate(TEMPLATE);

  // const model = new ChatOpenAI({
  //   temperature: 0.8,
  //   azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  //   azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
  //   azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
  //   azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  //   azureOpenAIBasePath: process.env.AZURE_OPENAI_BASE_PATH,
  // });

  const model = new ChatOpenAI({
    temperature: 0.9,
    azureOpenAIApiKey: "2bc42fc853bd46f8b81dfc51b99b23e3",
    azureOpenAIApiInstanceName: "lucidmvpopenai",
    azureOpenAIApiDeploymentName: "lucidchatbot",
    azureOpenAIApiVersion: "2023-03-15-preview",
    // azureOpenAIBasePath: "https://lucidmvpopenai.openai.azure.com/",
  });

  /**
   * Chat models stream message chunks rather than bytes, so this
   * output parser handles serialization and encoding.
   */
  const outputParser = new BytesOutputParser();

  /*
   * Can also initialize as:
   *
   * import { RunnableSequence } from "langchain/schema/runnable";
   * const chain = RunnableSequence.from([prompt, model, outputParser]);
   */
  //   const chain = RunnableSequence.from([prompt, model, outputParser]);
  const chain = prompt.pipe(model).pipe(outputParser);

  const stream = await chain.stream({
    chat_history: formattedPreviousMessages.join("\n"),
    input: currentMessageContent,
  });

  return new StreamingTextResponse(stream);
}
