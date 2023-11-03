"use client";

import { useChat } from "ai/react";
import { useEffect } from "react";

const Chat = ({ params }) => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // useEffect(() => {
  //   fetchData();
  // }, []);

  async function fetchData() {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines/sources?category=${params.slug}&&apiKey=a80185397ef84f5fa92311ae488d76bc`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      const data = await response.json();

      const postDataToModel = await fetch("/api/trainModel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: params.slug, data }),
      });
      if (!postDataToModel.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      {messages.length > 0
        ? messages.map((m) => (
            <div key={m.id} className="whitespace=pre-wrap">
              {m.role === "user" ? "User: " : "AI: "}
              {m.content}
            </div>
          ))
        : null}
      <form onSubmit={handleSubmit}>
        <input
          className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
};

export default Chat;
