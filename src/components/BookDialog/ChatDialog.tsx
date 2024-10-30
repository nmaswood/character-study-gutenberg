import { useChatDialog } from "@/app/hooks/useChatDialog";
import { Button } from "../ui/button";
import { Character } from "@/app/hooks/useBookDialog";
import { Input } from "../ui/input";
import { Send, Trash2 } from "lucide-react";
export default function ChatDialog({
  activeCharacter,
  handleCloseChat,
}: {
  activeCharacter: Character;
  handleCloseChat: () => void;
}) {
  const {
    characterName,
    characterQuote,
    chatHistory,
    streamingResponse,
    currentResponse,
    handleClearHistory,
    handleMessageContentUpdate,
    handleSendMessage,
    messageContent,
    messagesEndRef,
  } = useChatDialog(activeCharacter);

  return (
    <div className="p:2 flex flex-1 flex-col justify-between sm:p-6">
      {/* Character Name and Header */}
      <div className="flex justify-between border-b-2 border-gray-200 py-3 sm:items-center">
        <div className="relative flex items-center space-x-4">
          <div className="flex flex-col leading-tight transition-all duration-300">
            <div className="mt-1 flex items-center text-2xl">
              <span className="mr-3 text-gray-700">
                {characterName}{" "}
                <button className="inline" onClick={() => handleClearHistory()}>
                  <Trash2 width={16} className="mx-1 mb-1 inline text-red-600" />
                </button>
              </span>
            </div>
            <span className="text-lg text-gray-600">
              {`${characterQuote[0] === '"' ? characterQuote : `"${characterQuote}"`}`}
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={handleCloseChat} className="mt-4 self-end justify-self-end">
          Close Chat
        </Button>
      </div>
      {/* Chat Window */}
      <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex flex-col justify-start space-y-4 overflow-y-auto p-3">
        {chatHistory.length === 0 ? (
          <div className="flex items-start justify-center">
            <span className="inline-block px-4 py-2 text-gray-600">Send your first message to start chatting...</span>
          </div>
        ) : (
          [
            ...chatHistory.map((chatMessage, i) => (
              <div key={i}>
                {chatMessage.role === "model" ? (
                  <ModelMessage message={chatMessage.message} />
                ) : (
                  <UserMessage message={chatMessage.message} />
                )}
              </div>
            )),
            streamingResponse ? (
              <div key={chatHistory.length}>
                <ModelMessage message={currentResponse} />
              </div>
            ) : (
              <div key={chatHistory.length} />
            ),
          ]
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Textbox and send button */}
      <div className="mb-2 border-t-2 border-gray-200 px-4 pt-4 sm:mb-0">
        <form
          className="relative flex"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={messageContent}
            onChange={(e) => handleMessageContentUpdate(e.target.value)}
            type="text"
            placeholder="Write your message!"
            className="w-full rounded-md bg-gray-200 py-3 pl-4 text-gray-600 placeholder-gray-600 focus:placeholder-gray-400 focus:outline-none"
          />
          <div className="absolute inset-y-0 right-0 hidden items-center sm:flex">
            <Button
              type="submit"
              className="inline-flex items-center justify-center bg-blue-500 px-4 py-3 text-white transition duration-500 ease-in-out hover:bg-blue-400 focus:outline-none"
            >
              <Send />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const UserMessage = ({ message }: { message: string }) => (
  <div className="flex items-end justify-end">
    <div className="order-1 mx-2 flex max-w-xs flex-col items-end space-y-2 text-xs">
      <div>
        <span className="inline-block rounded-lg rounded-br-none bg-blue-600 px-4 py-2 text-white">{message}</span>
      </div>
    </div>
  </div>
);
const ModelMessage = ({ message }: { message: string }) => (
  <div className="flex items-end">
    <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
      <div>
        <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">{message}</span>
      </div>
    </div>
  </div>
);
