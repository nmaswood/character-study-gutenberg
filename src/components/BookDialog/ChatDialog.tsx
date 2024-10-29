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
        handleClearHistory,
        handleMessageContentUpdate,
        handleSendMessage,
        messageContent,
    } = useChatDialog(activeCharacter);

    return (
        <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col">
            {/* Character Name and Header */}
            <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div className="relative flex items-center space-x-4">
                    <div className="flex flex-col leading-tight transition-all duration-300">
                        <div className="text-2xl mt-1 flex items-center">
                            <span className="text-gray-700 mr-3">
                                {characterName}{" "}
                                <button
                                    className="inline"
                                    onClick={() => handleClearHistory()}
                                >
                                    <Trash2
                                        width={16}
                                        className="mx-1 mb-1  text-red-600 inline"
                                    />
                                </button>
                            </span>
                        </div>
                        <span className="text-lg text-gray-600">
                            {`"${characterQuote}"`}
                        </span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={handleCloseChat}
                    className="mt-4 justify-self-end self-end"
                >
                    Close Chat
                </Button>
            </div>
            {/* Chat Window */}
            <div className="flex flex-col justify-start space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                {chatHistory.length === 0 ? (
                    <div className="flex items-start justify-center">
                        <span className="px-4 py-2 inline-block  text-gray-600">
                            Send your first message to start chatting...
                        </span>
                    </div>
                ) : (
                    chatHistory.map((chatMessage, i) => (
                        <div key={i}>
                            {chatMessage.role === "model" ? (
                                <ModelMessage message={chatMessage.message} />
                            ) : (
                                <UserMessage message={chatMessage.message} />
                            )}
                        </div>
                    ))
                )}
            </div>
            {/* Textbox and send button */}
            <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                <form
                    className="relative flex"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                >
                    <Input
                        value={messageContent}
                        onChange={(e) =>
                            handleMessageContentUpdate(e.target.value)
                        }
                        type="text"
                        placeholder="Write your message!"
                        className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-4 bg-gray-200 rounded-md py-3"
                    />
                    <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                        <Button
                            type="submit"
                            className="inline-flex items-center justify-center px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
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
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
            <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                    {message}
                </span>
            </div>
        </div>
    </div>
);
const ModelMessage = ({ message }: { message: string }) => (
    <div className="flex items-end">
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
            <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                    {message}
                </span>
            </div>
        </div>
    </div>
);
