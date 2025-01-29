import { is, Predicate } from "./deps.ts"

export type CursorPosProtocol = {
  col: number
  line: number
  path: string
  sender: "vim" | "vscode"
  type: "CursorPos"
  paused: boolean
}

export const isCursorPosProtocol = is.ObjectOf({
  col: is.Number,
  line: is.Number,
  path: is.String,
  sender: is.LiteralOneOf(["vim", "vscode"] as const),
  type: is.LiteralOf("CursorPos"),
  paused: is.Boolean,
}) satisfies Predicate<CursorPosProtocol>

export type SelectionPosProtocol = {
  endCol: number
  endLine: number
  path: string
  sender: "vim" | "vscode"
  startCol: number
  startLine: number
  type: "SelectionPos"
  paused: boolean
}

export const isSelectionPosProtocol = is.ObjectOf({
  endCol: is.Number,
  endLine: is.Number,
  path: is.String,
  sender: is.LiteralOneOf(["vim", "vscode"] as const),
  startCol: is.Number,
  startLine: is.Number,
  type: is.LiteralOf("SelectionPos"),
  paused: is.Boolean,
}) satisfies Predicate<SelectionPosProtocol>

export type TextContentProtocol = {
  col: number
  line: number
  path: string
  sender: "vim" | "vscode"
  text: string
  type: "TextContent"
  paused: boolean
}

export const isTextContentProtocol = is.ObjectOf({
  col: is.Number,
  line: is.Number,
  path: is.String,
  sender: is.LiteralOneOf(["vim", "vscode"] as const),
  text: is.String,
  type: is.LiteralOf("TextContent"),
  paused: is.Boolean,
}) satisfies Predicate<TextContentProtocol>

export type MessageProtocol = CursorPosProtocol | SelectionPosProtocol | TextContentProtocol

export const isMessageProtocol = is.UnionOf([
  isCursorPosProtocol,
  isSelectionPosProtocol,
  isTextContentProtocol,
]) satisfies Predicate<MessageProtocol>


export type CursorPos = {
  col: number
  line: number
  path: string
}
