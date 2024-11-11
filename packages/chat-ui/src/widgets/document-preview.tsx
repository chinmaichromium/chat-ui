'use client'

import { FileIcon, XCircleIcon } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'
import { cn } from '../lib/utils'
import { DocumentFile, DocumentFileType } from '../chat/annotation'
import { DocxIcon } from '../ui/icons/docx'
import { TxtIcon } from '../ui/icons/txt'
import { PDFIcon } from '../ui/icons/pdf'
import { SheetIcon } from '../ui/icons/sheet'

export interface DocumentPreviewProps {
  file: DocumentFile
  onRemove?: () => void
}

export function DocumentPreview(props: DocumentPreviewProps) {
  const { name, size, type, refs } = props.file

  if (refs?.length) {
    return (
      <div title={`Document IDs: ${refs.join(', ')}`}>
        <DocumentPreviewCard {...props} />
      </div>
    )
  }

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <div>
          <DocumentPreviewCard className="cursor-pointer" {...props} />
        </div>
      </DrawerTrigger>
      <DrawerContent className="mt-24 h-full max-h-[96%] w-3/5 ">
        <DrawerHeader className="flex justify-between">
          <div className="space-y-2">
            <DrawerTitle>{type.toUpperCase()} Raw Content</DrawerTitle>
            <DrawerDescription>
              {name} ({inKB(size)} KB)
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="m-4 max-h-[80%] overflow-auto">
          {refs?.length && (
            <pre className="bg-secondary block rounded-md p-4 text-sm">
              {refs.join(', ')}
            </pre>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export const FileIconMap: Record<DocumentFileType, React.ReactNode> = {
  csv: <SheetIcon />,
  pdf: <PDFIcon />,
  docx: <DocxIcon />,
  txt: <TxtIcon />,
}

export function DocumentPreviewCard(props: {
  file: {
    name: string
    size?: number
    type: DocumentFileType
  }
  onRemove?: () => void
  className?: string
}) {
  const { onRemove, file, className } = props
  return (
    <div
      className={cn(
        'bg-secondary relative w-60 max-w-60 rounded-lg p-2 text-sm',
        className
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md">
          {FileIconMap[file.type] ?? <FileIcon />}
        </div>
        <div className="overflow-hidden">
          <div className="truncate font-semibold">
            {file.name} {file.size ? `(${inKB(file.size)} KB)` : ''}
          </div>
          {file.type && (
            <div className="text-token-text-tertiary flex items-center gap-2 truncate">
              <span>{file.type.toUpperCase()} File</span>
            </div>
          )}
        </div>
      </div>
      {onRemove && (
        <div
          className={cn(
            'absolute -right-2 -top-2 z-10 h-6 w-6 rounded-full bg-gray-500 text-white'
          )}
        >
          <XCircleIcon
            className="h-6 w-6 rounded-full bg-gray-500 text-white"
            onClick={onRemove}
          />
        </div>
      )}
    </div>
  )
}

function inKB(size: number) {
  return Math.round((size / 1024) * 10) / 10
}
