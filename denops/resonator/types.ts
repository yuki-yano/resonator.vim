import { is, PredicateType } from "./deps.ts"

export const isCursorPosProtocol = is.ObjectOf({
  col: is.Number,
  line: is.Number,
  path: is.String,
  sender: is.LiteralOneOf(["vim", "vscode"] as const),
  type: is.LiteralOf("CursorPos"),
  paused: is.Boolean,
})
export type CursorPosProtocol = PredicateType<typeof isCursorPosProtocol>

export const isSelectionPosProtocol = is.ObjectOf({
  endCol: is.Number,
  endLine: is.Number,
  path: is.String,
  sender: is.LiteralOneOf(["vim", "vscode"] as const),
  startCol: is.Number,
  startLine: is.Number,
  type: is.LiteralOf("SelectionPos"),
  paused: is.Boolean,
})
export type SelectionPosProtocol = PredicateType<typeof isSelectionPosProtocol>

export const isTextContentProtocol = is.ObjectOf({
  col: is.Number,
  line: is.Number,
  path: is.String,
  sender: is.LiteralOneOf(["vim", "vscode"] as const),
  text: is.String,
  type: is.LiteralOf("TextContent"),
  paused: is.Boolean,
})
export type TextContentProtocol = PredicateType<typeof isTextContentProtocol>

export const isMessageProtocol = is.UnionOf([
  isCursorPosProtocol,
  isSelectionPosProtocol,
  isTextContentProtocol,
])
export type MessageProtocol = CursorPosProtocol | SelectionPosProtocol | TextContentProtocol

export type CursorPos = {
  col: number
  line: number
  path: string
}
