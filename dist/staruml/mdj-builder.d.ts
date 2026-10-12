import type { GenerateClassDiagramInput, GenerateUseCaseDiagramInput, GenerateSequenceDiagramInput, GenerateActivityDiagramInput, GenerateStateMachineDiagramInput, GenerateComponentDiagramInput, GenerateDeploymentDiagramInput, GenerateObjectDiagramInput, GenerateCommunicationDiagramInput, StarUMLNode } from "../types.js";
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
/**
 * Builds a complete StarUML (.mdj) AST for an Activity Diagram.
 */
export declare function buildActivityDiagramMdj(input: GenerateActivityDiagramInput): StarUMLNode;
/**
 * Builds a complete StarUML (.mdj) AST for a State Machine Diagram.
 */
export declare function buildStateMachineDiagramMdj(input: GenerateStateMachineDiagramInput): StarUMLNode;
/**
 * Builds a complete StarUML (.mdj) AST for a Component Diagram.
 */
export declare function buildComponentDiagramMdj(input: GenerateComponentDiagramInput): StarUMLNode;
/**
 * Builds a complete StarUML (.mdj) AST for a Deployment Diagram.
 */
export declare function buildDeploymentDiagramMdj(input: GenerateDeploymentDiagramInput): StarUMLNode;
/**
 * Builds a complete StarUML (.mdj) AST for an Object Diagram.
 */
export declare function buildObjectDiagramMdj(input: GenerateObjectDiagramInput): StarUMLNode;
/**
 * Builds a complete StarUML (.mdj) AST for a Communication Diagram.
 */
export declare function buildCommunicationDiagramMdj(input: GenerateCommunicationDiagramInput): StarUMLNode;
