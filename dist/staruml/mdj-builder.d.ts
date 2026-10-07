import type { GenerateClassDiagramInput, GenerateUseCaseDiagramInput, GenerateSequenceDiagramInput, StarUMLNode } from "../types.js";
/**
 * Builds a complete, valid StarUML (.mdj) AST for a Class Diagram.
 */
export declare function buildClassDiagramMdj(input: GenerateClassDiagramInput): StarUMLNode;
/**
 * Builds a complete, valid StarUML (.mdj) AST for a Use Case Diagram.
 */
export declare function buildUseCaseDiagramMdj(input: GenerateUseCaseDiagramInput): StarUMLNode;
/**
 * Builds a complete, valid StarUML (.mdj) AST for a Sequence Diagram.
 */
export declare function buildSequenceDiagramMdj(input: GenerateSequenceDiagramInput): StarUMLNode;
