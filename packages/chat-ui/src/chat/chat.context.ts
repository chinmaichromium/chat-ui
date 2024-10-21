import { createContext, useContext } from 'react'
import { type ChatHandler } from './chat.interface'

export interface ChatContext extends ChatHandler {}

export const chatContext = createContext<ChatContext | null>(null)

export const ChatProvider = chatContext.Provider

export const useChat = () => {
  const context = useContext(chatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
