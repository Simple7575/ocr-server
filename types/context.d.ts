import { Context, Api } from "grammy";
import { type SessionFlavor } from "@grammyjs/conversations/out/deps.node";
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
} from "@grammyjs/conversations";
import { FileApiFlavor, FileFlavor } from "@grammyjs/files";

interface SessionData {
    redisstorage: {};
}

export type ContextType = FileFlavor<Context> & ConversationFlavor & SessionFlavor<SessionData>;
export type ApiType = FileApiFlavor<Api>;
export type ConversationType = Conversation<ContextType>;
