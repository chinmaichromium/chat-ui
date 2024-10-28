import { createContext, memo, useContext } from 'react'
import { cn } from '../lib/utils'
import { Message } from './chat.interface'
import { Bot, Check, Copy, MessageCircle, User2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useCopyToClipboard } from '../hook/use-copy-to-clipboard'
import { Markdown } from '../widget/markdown'

interface ChatMessageProps extends React.PropsWithChildren {
  message: Message
  isLast: boolean
  className?: string
}

interface ChatMessageAvatarProps extends React.PropsWithChildren {
  className?: string
}

interface ChatMessageContentProps extends React.PropsWithChildren {
  className?: string
}

interface ChatMessageActionsProps extends React.PropsWithChildren {
  className?: string
}

interface ChatMessageContext {
  message: Message
  isLast: boolean
}

const chatMessageContext = createContext<ChatMessageContext | null>(null)

const ChatMessageProvider = chatMessageContext.Provider

export const useChatMessage = () => {
  const context = useContext(chatMessageContext)
  if (!context)
    throw new Error('useChatMessage must be used within a ChatMessageProvider')
  return context
}

function ChatMessage(props: ChatMessageProps) {
  const children = props.children ?? (
    <>
      <ChatMessageAvatar />
      <ChatMessageContent />
      <ChatMessageActions />
    </>
  )

  return (
    <ChatMessageProvider
      value={{ message: props.message, isLast: props.isLast }}
    >
      <div className={cn('group flex gap-4 pr-2 pt-4', props.className)}>
        {children}
      </div>
    </ChatMessageProvider>
  )
}

function ChatMessageAvatar(props: ChatMessageAvatarProps) {
  const { message } = useChatMessage()

  const roleIconMap: Record<string, React.ReactNode> = {
    user: <User2 className="h-4 w-4" />,
    assistant: <Bot className="h-4 w-4" />,
  }

  const children = props.children ?? roleIconMap[message.role] ?? (
    <MessageCircle className="h-4 w-4" />
  )

  return (
    <div className="bg-background flex h-8 w-8 shrink-0 select-none items-center justify-center border">
      {children}
    </div>
  )
}

function ChatMessageContent(props: ChatMessageContentProps) {
  const { message } = useChatMessage()
  const children = props.children ?? <Markdown content={message.content} />
  return (
    <div className={cn('flex flex-1 flex-col gap-4', props.className)}>
      {children}
    </div>
  )
}

function ChatMessageActions(props: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const { message } = useChatMessage()

  const children = props.children ?? (
    <Button
      onClick={() => copyToClipboard(message.content)}
      size="icon"
      variant="ghost"
      className="h-8 w-8"
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col gap-2 opacity-0 group-hover:opacity-100',
        props.className
      )}
    >
      {children}
    </div>
  )
}

type ComposibleChatMessage = typeof ChatMessage & {
  Avatar: typeof ChatMessageAvatar
  Content: typeof ChatMessageContent
  Actions: typeof ChatMessageActions
}

const PrimiviteChatMessage = memo(ChatMessage, (prevProps, nextProps) => {
  return (
    !nextProps.isLast &&
    prevProps.isLast === nextProps.isLast &&
    prevProps.message === nextProps.message
  )
}) as unknown as ComposibleChatMessage

PrimiviteChatMessage.Avatar = ChatMessageAvatar
PrimiviteChatMessage.Content = ChatMessageContent
PrimiviteChatMessage.Actions = ChatMessageActions

export default PrimiviteChatMessage
