import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const endpoint = `https://${process.env.AZURE_OPENAI_API_INSTANCE_NAME}.openai.azure.com`;

export const config = new Configuration({
  basePath: `${endpoint}/openai/deployments/${process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME}`,
  defaultQueryParams: new URLSearchParams({
    "api-version": "2023-03-15-preview",
  }),
  baseOptions: {
    headers: {
      "api-key": process.env.AZURE_OPENAI_API_KEY,
    },
  },
});

const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: messages.map((message: any) => ({
      content: message.content,
      role: message.role,
    })),
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
