import { NextRequest } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { TextLoader } from "langchain/document_loaders/fs/text";

// export const runtime = "edge";

const splitter = new CharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 50,
});

export async function POST(req: NextRequest) {
  const { category, data } = await req.json();
  // console.log(data);
  // const loader = new JSONLoader(JSON.stringify(data.sources));
  const loader = new JSONLoader("../example.json");
  const docs = await loader.load();
  const documents = await splitter.splitDocuments(docs);
  // const text = "foo bar baz 123";
  // const splitter = new CharacterTextSplitter({
  //   separator: " ",
  //   chunkSize: 7,
  //   chunkOverlap: 3,
  // });
  // const documents = await splitter.createDocuments([text]);
  // console.log(documents);

  const embeddings = new OpenAIEmbeddings();
  //now pass the docs and embeddings to the FaissStore.
  const vectorStore = await FaissStore.fromDocuments(documents, embeddings);
  await vectorStore.save(`./`); //To save the vector store at this path ('./').

  // console.log("hahahah");

  // const body = await req.json();
  // const messages = body.messages ?? [];
  // const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  // const currentMessageContent = messages[messages.length - 1].content;

  // const prompt = PromptTemplate.fromTemplate(TEMPLATE);
  // const model = new ChatOpenAI({
  //   temperature: 0.8,
  //   maxTokens: 50,
  // });

  // const outputParser = new BytesOutputParser();

  // const chain = prompt.pipe(model).pipe(outputParser);

  // const stream = await chain.stream({
  //   chat_history: formattedPreviousMessages.join("\n"),
  //   input: currentMessageContent,
  // });

  // return new StreamingTextResponse(stream);
  return;
}
