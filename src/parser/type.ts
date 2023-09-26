export interface Program {
    type: 'Program'
    body: Array<Statement | ModuleDeclaration>
}

export interface Node {
    type: string
    [key: string]: any
}

export type Statement = Node
export type Expression = Node

export type ModuleDeclaration = AnyInclude

export interface AnyInclude {
    type: 'IncludeDeclaration'
    specifiers: Array<IncludeSpecifier>
}

export type IncludeSpecifier = string
