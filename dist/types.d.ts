import { z } from "zod";
/**
 * Reusable schema for validating StarUML (.mdj) file paths.
 * Enforces non-empty string and valid .mdj extension.
 */
export declare const MdjFilePathSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const ClassAttributeSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    visibility: z.ZodOptional<z.ZodEnum<["public", "protected", "private", "package"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: string;
    visibility?: "public" | "protected" | "private" | "package" | undefined;
}, {
    name: string;
    type: string;
    visibility?: "public" | "protected" | "private" | "package" | undefined;
}>;
export declare const ClassOperationParameterSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: string;
}, {
    name: string;
    type: string;
}>;
export declare const ClassOperationSchema: z.ZodObject<{
    name: z.ZodString;
    returnType: z.ZodOptional<z.ZodString>;
    visibility: z.ZodOptional<z.ZodEnum<["public", "protected", "private", "package"]>>;
    parameters: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: string;
    }, {
        name: string;
        type: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    visibility?: "public" | "protected" | "private" | "package" | undefined;
    returnType?: string | undefined;
    parameters?: {
        name: string;
        type: string;
    }[] | undefined;
}, {
    name: string;
    visibility?: "public" | "protected" | "private" | "package" | undefined;
    returnType?: string | undefined;
    parameters?: {
        name: string;
        type: string;
    }[] | undefined;
}>;
export declare const ClassEntitySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    stereotype: z.ZodOptional<z.ZodString>;
    attributes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        visibility: z.ZodOptional<z.ZodEnum<["public", "protected", "private", "package"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: string;
        visibility?: "public" | "protected" | "private" | "package" | undefined;
    }, {
        name: string;
        type: string;
        visibility?: "public" | "protected" | "private" | "package" | undefined;
    }>, "many">>;
    operations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        returnType: z.ZodOptional<z.ZodString>;
        visibility: z.ZodOptional<z.ZodEnum<["public", "protected", "private", "package"]>>;
        parameters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: string;
        }, {
            name: string;
            type: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        visibility?: "public" | "protected" | "private" | "package" | undefined;
        returnType?: string | undefined;
        parameters?: {
            name: string;
            type: string;
        }[] | undefined;
    }, {
        name: string;
        visibility?: "public" | "protected" | "private" | "package" | undefined;
        returnType?: string | undefined;
        parameters?: {
            name: string;
            type: string;
        }[] | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    stereotype?: string | undefined;
    attributes?: {
        name: string;
        type: string;
        visibility?: "public" | "protected" | "private" | "package" | undefined;
    }[] | undefined;
    operations?: {
        name: string;
        visibility?: "public" | "protected" | "private" | "package" | undefined;
        returnType?: string | undefined;
        parameters?: {
            name: string;
            type: string;
        }[] | undefined;
    }[] | undefined;
}, {
    name: string;
    id: string;
    stereotype?: string | undefined;
    attributes?: {
        name: string;
        type: string;
        visibility?: "public" | "protected" | "private" | "package" | undefined;
    }[] | undefined;
    operations?: {
        name: string;
        visibility?: "public" | "protected" | "private" | "package" | undefined;
        returnType?: string | undefined;
        parameters?: {
            name: string;
            type: string;
        }[] | undefined;
    }[] | undefined;
}>;
export declare const ClassRelationshipSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["association", "generalization", "composition", "aggregation", "dependency", "realization"]>;
    sourceId: z.ZodString;
    targetId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    sourceMultiplicity: z.ZodOptional<z.ZodString>;
    targetMultiplicity: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "association" | "generalization" | "composition" | "aggregation" | "dependency" | "realization";
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
    sourceMultiplicity?: string | undefined;
    targetMultiplicity?: string | undefined;
}, {
    type: "association" | "generalization" | "composition" | "aggregation" | "dependency" | "realization";
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
    sourceMultiplicity?: string | undefined;
    targetMultiplicity?: string | undefined;
}>;
export declare const GenerateClassDiagramSchema: z.ZodObject<{
    filePath: z.ZodEffects<z.ZodString, string, string>;
    projectName: z.ZodOptional<z.ZodString>;
    diagramName: z.ZodString;
    classes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        stereotype: z.ZodOptional<z.ZodString>;
        attributes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            visibility: z.ZodOptional<z.ZodEnum<["public", "protected", "private", "package"]>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
        }, {
            name: string;
            type: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
        }>, "many">>;
        operations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            returnType: z.ZodOptional<z.ZodString>;
            visibility: z.ZodOptional<z.ZodEnum<["public", "protected", "private", "package"]>>;
            parameters: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                type: string;
            }, {
                name: string;
                type: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
            returnType?: string | undefined;
            parameters?: {
                name: string;
                type: string;
            }[] | undefined;
        }, {
            name: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
            returnType?: string | undefined;
            parameters?: {
                name: string;
                type: string;
            }[] | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        stereotype?: string | undefined;
        attributes?: {
            name: string;
            type: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
        }[] | undefined;
        operations?: {
            name: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
            returnType?: string | undefined;
            parameters?: {
                name: string;
                type: string;
            }[] | undefined;
        }[] | undefined;
    }, {
        name: string;
        id: string;
        stereotype?: string | undefined;
        attributes?: {
            name: string;
            type: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
        }[] | undefined;
        operations?: {
            name: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
            returnType?: string | undefined;
            parameters?: {
                name: string;
                type: string;
            }[] | undefined;
        }[] | undefined;
    }>, "many">;
    relationships: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["association", "generalization", "composition", "aggregation", "dependency", "realization"]>;
        sourceId: z.ZodString;
        targetId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        sourceMultiplicity: z.ZodOptional<z.ZodString>;
        targetMultiplicity: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "association" | "generalization" | "composition" | "aggregation" | "dependency" | "realization";
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        sourceMultiplicity?: string | undefined;
        targetMultiplicity?: string | undefined;
    }, {
        type: "association" | "generalization" | "composition" | "aggregation" | "dependency" | "realization";
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        sourceMultiplicity?: string | undefined;
        targetMultiplicity?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    diagramName: string;
    classes: {
        name: string;
        id: string;
        stereotype?: string | undefined;
        attributes?: {
            name: string;
            type: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
        }[] | undefined;
        operations?: {
            name: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
            returnType?: string | undefined;
            parameters?: {
                name: string;
                type: string;
            }[] | undefined;
        }[] | undefined;
    }[];
    relationships: {
        type: "association" | "generalization" | "composition" | "aggregation" | "dependency" | "realization";
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        sourceMultiplicity?: string | undefined;
        targetMultiplicity?: string | undefined;
    }[];
    projectName?: string | undefined;
}, {
    filePath: string;
    diagramName: string;
    classes: {
        name: string;
        id: string;
        stereotype?: string | undefined;
        attributes?: {
            name: string;
            type: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
        }[] | undefined;
        operations?: {
            name: string;
            visibility?: "public" | "protected" | "private" | "package" | undefined;
            returnType?: string | undefined;
            parameters?: {
                name: string;
                type: string;
            }[] | undefined;
        }[] | undefined;
    }[];
    relationships: {
        type: "association" | "generalization" | "composition" | "aggregation" | "dependency" | "realization";
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        sourceMultiplicity?: string | undefined;
        targetMultiplicity?: string | undefined;
    }[];
    projectName?: string | undefined;
}>;
export type GenerateClassDiagramInput = z.infer<typeof GenerateClassDiagramSchema>;
export type ClassEntity = z.infer<typeof ClassEntitySchema>;
export type ClassRelationship = z.infer<typeof ClassRelationshipSchema>;
export declare const ActorEntitySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
export declare const UseCaseEntitySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    systemBoundary: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    systemBoundary?: string | undefined;
}, {
    name: string;
    id: string;
    systemBoundary?: string | undefined;
}>;
export declare const UseCaseRelationshipSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["association", "include", "extend", "generalization"]>;
    sourceId: z.ZodString;
    targetId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "association" | "generalization" | "include" | "extend";
    id: string;
    sourceId: string;
    targetId: string;
}, {
    type: "association" | "generalization" | "include" | "extend";
    id: string;
    sourceId: string;
    targetId: string;
}>;
export declare const GenerateUseCaseDiagramSchema: z.ZodObject<{
    filePath: z.ZodEffects<z.ZodString, string, string>;
    projectName: z.ZodOptional<z.ZodString>;
    diagramName: z.ZodString;
    actors: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>, "many">;
    useCases: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        systemBoundary: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        systemBoundary?: string | undefined;
    }, {
        name: string;
        id: string;
        systemBoundary?: string | undefined;
    }>, "many">;
    relationships: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["association", "include", "extend", "generalization"]>;
        sourceId: z.ZodString;
        targetId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "association" | "generalization" | "include" | "extend";
        id: string;
        sourceId: string;
        targetId: string;
    }, {
        type: "association" | "generalization" | "include" | "extend";
        id: string;
        sourceId: string;
        targetId: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    diagramName: string;
    relationships: {
        type: "association" | "generalization" | "include" | "extend";
        id: string;
        sourceId: string;
        targetId: string;
    }[];
    actors: {
        name: string;
        id: string;
    }[];
    useCases: {
        name: string;
        id: string;
        systemBoundary?: string | undefined;
    }[];
    projectName?: string | undefined;
}, {
    filePath: string;
    diagramName: string;
    relationships: {
        type: "association" | "generalization" | "include" | "extend";
        id: string;
        sourceId: string;
        targetId: string;
    }[];
    actors: {
        name: string;
        id: string;
    }[];
    useCases: {
        name: string;
        id: string;
        systemBoundary?: string | undefined;
    }[];
    projectName?: string | undefined;
}>;
export type GenerateUseCaseDiagramInput = z.infer<typeof GenerateUseCaseDiagramSchema>;
export type ActorEntity = z.infer<typeof ActorEntitySchema>;
export type UseCaseEntity = z.infer<typeof UseCaseEntitySchema>;
export type UseCaseRelationship = z.infer<typeof UseCaseRelationshipSchema>;
export declare const LifelineEntitySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    representClass: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    representClass?: string | undefined;
}, {
    name: string;
    id: string;
    representClass?: string | undefined;
}>;
export declare const SequenceMessageSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    sourceLifelineId: z.ZodString;
    targetLifelineId: z.ZodString;
    messageSort: z.ZodEnum<["synchCall", "asynchCall", "reply"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    messageSort: "synchCall" | "asynchCall" | "reply";
}, {
    name: string;
    id: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    messageSort: "synchCall" | "asynchCall" | "reply";
}>;
export declare const GenerateSequenceDiagramSchema: z.ZodObject<{
    filePath: z.ZodEffects<z.ZodString, string, string>;
    projectName: z.ZodOptional<z.ZodString>;
    diagramName: z.ZodString;
    lifelines: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        representClass: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        representClass?: string | undefined;
    }, {
        name: string;
        id: string;
        representClass?: string | undefined;
    }>, "many">;
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        sourceLifelineId: z.ZodString;
        targetLifelineId: z.ZodString;
        messageSort: z.ZodEnum<["synchCall", "asynchCall", "reply"]>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        sourceLifelineId: string;
        targetLifelineId: string;
        messageSort: "synchCall" | "asynchCall" | "reply";
    }, {
        name: string;
        id: string;
        sourceLifelineId: string;
        targetLifelineId: string;
        messageSort: "synchCall" | "asynchCall" | "reply";
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    diagramName: string;
    lifelines: {
        name: string;
        id: string;
        representClass?: string | undefined;
    }[];
    messages: {
        name: string;
        id: string;
        sourceLifelineId: string;
        targetLifelineId: string;
        messageSort: "synchCall" | "asynchCall" | "reply";
    }[];
    projectName?: string | undefined;
}, {
    filePath: string;
    diagramName: string;
    lifelines: {
        name: string;
        id: string;
        representClass?: string | undefined;
    }[];
    messages: {
        name: string;
        id: string;
        sourceLifelineId: string;
        targetLifelineId: string;
        messageSort: "synchCall" | "asynchCall" | "reply";
    }[];
    projectName?: string | undefined;
}>;
export type GenerateSequenceDiagramInput = z.infer<typeof GenerateSequenceDiagramSchema>;
export type LifelineEntity = z.infer<typeof LifelineEntitySchema>;
export type SequenceMessage = z.infer<typeof SequenceMessageSchema>;
export declare const InspectMdjModelSchema: z.ZodObject<{
    filePath: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
}, {
    filePath: string;
}>;
export declare const ActivityNodeTypeEnum: z.ZodEnum<["initial", "action", "decision", "merge", "fork", "join", "final", "flowFinal"]>;
export declare const ActivityNodeSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["initial", "action", "decision", "merge", "fork", "join", "final", "flowFinal"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "join" | "initial" | "action" | "decision" | "merge" | "fork" | "final" | "flowFinal";
    id: string;
}, {
    name: string;
    type: "join" | "initial" | "action" | "decision" | "merge" | "fork" | "final" | "flowFinal";
    id: string;
}>;
export declare const ActivityFlowSchema: z.ZodObject<{
    id: z.ZodString;
    sourceId: z.ZodString;
    targetId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    guard: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
    guard?: string | undefined;
}, {
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
    guard?: string | undefined;
}>;
export declare const GenerateActivityDiagramSchema: z.ZodObject<{
    filePath: z.ZodEffects<z.ZodString, string, string>;
    projectName: z.ZodOptional<z.ZodString>;
    diagramName: z.ZodString;
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<["initial", "action", "decision", "merge", "fork", "join", "final", "flowFinal"]>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "join" | "initial" | "action" | "decision" | "merge" | "fork" | "final" | "flowFinal";
        id: string;
    }, {
        name: string;
        type: "join" | "initial" | "action" | "decision" | "merge" | "fork" | "final" | "flowFinal";
        id: string;
    }>, "many">;
    flows: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sourceId: z.ZodString;
        targetId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        guard: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        guard?: string | undefined;
    }, {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        guard?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    diagramName: string;
    nodes: {
        name: string;
        type: "join" | "initial" | "action" | "decision" | "merge" | "fork" | "final" | "flowFinal";
        id: string;
    }[];
    flows: {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        guard?: string | undefined;
    }[];
    projectName?: string | undefined;
}, {
    filePath: string;
    diagramName: string;
    nodes: {
        name: string;
        type: "join" | "initial" | "action" | "decision" | "merge" | "fork" | "final" | "flowFinal";
        id: string;
    }[];
    flows: {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        guard?: string | undefined;
    }[];
    projectName?: string | undefined;
}>;
export type GenerateActivityDiagramInput = z.infer<typeof GenerateActivityDiagramSchema>;
export type ActivityNode = z.infer<typeof ActivityNodeSchema>;
export type ActivityFlow = z.infer<typeof ActivityFlowSchema>;
export declare const StateNodeTypeEnum: z.ZodEnum<["initial", "state", "final", "choice", "junction"]>;
export declare const StateNodeSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["initial", "state", "final", "choice", "junction"]>;
    entryActivity: z.ZodOptional<z.ZodString>;
    exitActivity: z.ZodOptional<z.ZodString>;
    doActivity: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "initial" | "final" | "state" | "choice" | "junction";
    id: string;
    entryActivity?: string | undefined;
    exitActivity?: string | undefined;
    doActivity?: string | undefined;
}, {
    name: string;
    type: "initial" | "final" | "state" | "choice" | "junction";
    id: string;
    entryActivity?: string | undefined;
    exitActivity?: string | undefined;
    doActivity?: string | undefined;
}>;
export declare const StateTransitionSchema: z.ZodObject<{
    id: z.ZodString;
    sourceId: z.ZodString;
    targetId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    trigger: z.ZodOptional<z.ZodString>;
    guard: z.ZodOptional<z.ZodString>;
    effect: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
    guard?: string | undefined;
    trigger?: string | undefined;
    effect?: string | undefined;
}, {
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
    guard?: string | undefined;
    trigger?: string | undefined;
    effect?: string | undefined;
}>;
export declare const GenerateStateMachineDiagramSchema: z.ZodObject<{
    filePath: z.ZodEffects<z.ZodString, string, string>;
    projectName: z.ZodOptional<z.ZodString>;
    diagramName: z.ZodString;
    states: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<["initial", "state", "final", "choice", "junction"]>;
        entryActivity: z.ZodOptional<z.ZodString>;
        exitActivity: z.ZodOptional<z.ZodString>;
        doActivity: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "initial" | "final" | "state" | "choice" | "junction";
        id: string;
        entryActivity?: string | undefined;
        exitActivity?: string | undefined;
        doActivity?: string | undefined;
    }, {
        name: string;
        type: "initial" | "final" | "state" | "choice" | "junction";
        id: string;
        entryActivity?: string | undefined;
        exitActivity?: string | undefined;
        doActivity?: string | undefined;
    }>, "many">;
    transitions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sourceId: z.ZodString;
        targetId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        trigger: z.ZodOptional<z.ZodString>;
        guard: z.ZodOptional<z.ZodString>;
        effect: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        guard?: string | undefined;
        trigger?: string | undefined;
        effect?: string | undefined;
    }, {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        guard?: string | undefined;
        trigger?: string | undefined;
        effect?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    diagramName: string;
    states: {
        name: string;
        type: "initial" | "final" | "state" | "choice" | "junction";
        id: string;
        entryActivity?: string | undefined;
        exitActivity?: string | undefined;
        doActivity?: string | undefined;
    }[];
    transitions: {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        guard?: string | undefined;
        trigger?: string | undefined;
        effect?: string | undefined;
    }[];
    projectName?: string | undefined;
}, {
    filePath: string;
    diagramName: string;
    states: {
        name: string;
        type: "initial" | "final" | "state" | "choice" | "junction";
        id: string;
        entryActivity?: string | undefined;
        exitActivity?: string | undefined;
        doActivity?: string | undefined;
    }[];
    transitions: {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
        guard?: string | undefined;
        trigger?: string | undefined;
        effect?: string | undefined;
    }[];
    projectName?: string | undefined;
}>;
export type GenerateStateMachineDiagramInput = z.infer<typeof GenerateStateMachineDiagramSchema>;
export type StateNode = z.infer<typeof StateNodeSchema>;
export type StateTransition = z.infer<typeof StateTransitionSchema>;
export declare const ComponentEntitySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    stereotype: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    stereotype?: string | undefined;
}, {
    name: string;
    id: string;
    stereotype?: string | undefined;
}>;
export declare const ComponentInterfaceSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
}, {
    name: string;
    id: string;
}>;
export declare const ComponentRelationshipSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["dependency", "realization", "association"]>;
    sourceId: z.ZodString;
    targetId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "association" | "dependency" | "realization";
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
}, {
    type: "association" | "dependency" | "realization";
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
}>;
export declare const GenerateComponentDiagramSchema: z.ZodObject<{
    filePath: z.ZodEffects<z.ZodString, string, string>;
    projectName: z.ZodOptional<z.ZodString>;
    diagramName: z.ZodString;
    components: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        stereotype: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        stereotype?: string | undefined;
    }, {
        name: string;
        id: string;
        stereotype?: string | undefined;
    }>, "many">;
    interfaces: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
    }, {
        name: string;
        id: string;
    }>, "many">>;
    relationships: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["dependency", "realization", "association"]>;
        sourceId: z.ZodString;
        targetId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "association" | "dependency" | "realization";
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }, {
        type: "association" | "dependency" | "realization";
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    diagramName: string;
    relationships: {
        type: "association" | "dependency" | "realization";
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }[];
    components: {
        name: string;
        id: string;
        stereotype?: string | undefined;
    }[];
    projectName?: string | undefined;
    interfaces?: {
        name: string;
        id: string;
    }[] | undefined;
}, {
    filePath: string;
    diagramName: string;
    relationships: {
        type: "association" | "dependency" | "realization";
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }[];
    components: {
        name: string;
        id: string;
        stereotype?: string | undefined;
    }[];
    projectName?: string | undefined;
    interfaces?: {
        name: string;
        id: string;
    }[] | undefined;
}>;
export type GenerateComponentDiagramInput = z.infer<typeof GenerateComponentDiagramSchema>;
export type ComponentEntity = z.infer<typeof ComponentEntitySchema>;
export type ComponentInterface = z.infer<typeof ComponentInterfaceSchema>;
export type ComponentRelationship = z.infer<typeof ComponentRelationshipSchema>;
export declare const DeploymentNodeSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    stereotype: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    stereotype?: string | undefined;
}, {
    name: string;
    id: string;
    stereotype?: string | undefined;
}>;
export declare const DeploymentArtifactSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    nodeId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    nodeId?: string | undefined;
}, {
    name: string;
    id: string;
    nodeId?: string | undefined;
}>;
export declare const DeploymentConnectionSchema: z.ZodObject<{
    id: z.ZodString;
    sourceId: z.ZodString;
    targetId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
}, {
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
}>;
export declare const GenerateDeploymentDiagramSchema: z.ZodObject<{
    filePath: z.ZodEffects<z.ZodString, string, string>;
    projectName: z.ZodOptional<z.ZodString>;
    diagramName: z.ZodString;
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        stereotype: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        stereotype?: string | undefined;
    }, {
        name: string;
        id: string;
        stereotype?: string | undefined;
    }>, "many">;
    artifacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        nodeId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        nodeId?: string | undefined;
    }, {
        name: string;
        id: string;
        nodeId?: string | undefined;
    }>, "many">>;
    connections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sourceId: z.ZodString;
        targetId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }, {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    diagramName: string;
    nodes: {
        name: string;
        id: string;
        stereotype?: string | undefined;
    }[];
    connections: {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }[];
    projectName?: string | undefined;
    artifacts?: {
        name: string;
        id: string;
        nodeId?: string | undefined;
    }[] | undefined;
}, {
    filePath: string;
    diagramName: string;
    nodes: {
        name: string;
        id: string;
        stereotype?: string | undefined;
    }[];
    connections: {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }[];
    projectName?: string | undefined;
    artifacts?: {
        name: string;
        id: string;
        nodeId?: string | undefined;
    }[] | undefined;
}>;
export type GenerateDeploymentDiagramInput = z.infer<typeof GenerateDeploymentDiagramSchema>;
export type DeploymentNode = z.infer<typeof DeploymentNodeSchema>;
export type DeploymentArtifact = z.infer<typeof DeploymentArtifactSchema>;
export type DeploymentConnection = z.infer<typeof DeploymentConnectionSchema>;
export declare const ObjectSlotSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    value: string;
}, {
    name: string;
    value: string;
}>;
export declare const ObjectEntitySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    className: z.ZodOptional<z.ZodString>;
    slots: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        value: string;
    }, {
        name: string;
        value: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    className?: string | undefined;
    slots?: {
        name: string;
        value: string;
    }[] | undefined;
}, {
    name: string;
    id: string;
    className?: string | undefined;
    slots?: {
        name: string;
        value: string;
    }[] | undefined;
}>;
export declare const ObjectLinkSchema: z.ZodObject<{
    id: z.ZodString;
    sourceId: z.ZodString;
    targetId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
}, {
    id: string;
    sourceId: string;
    targetId: string;
    name?: string | undefined;
}>;
export declare const GenerateObjectDiagramSchema: z.ZodObject<{
    filePath: z.ZodEffects<z.ZodString, string, string>;
    projectName: z.ZodOptional<z.ZodString>;
    diagramName: z.ZodString;
    objects: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        className: z.ZodOptional<z.ZodString>;
        slots: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            value: string;
        }, {
            name: string;
            value: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        className?: string | undefined;
        slots?: {
            name: string;
            value: string;
        }[] | undefined;
    }, {
        name: string;
        id: string;
        className?: string | undefined;
        slots?: {
            name: string;
            value: string;
        }[] | undefined;
    }>, "many">;
    links: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sourceId: z.ZodString;
        targetId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }, {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    diagramName: string;
    objects: {
        name: string;
        id: string;
        className?: string | undefined;
        slots?: {
            name: string;
            value: string;
        }[] | undefined;
    }[];
    links: {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }[];
    projectName?: string | undefined;
}, {
    filePath: string;
    diagramName: string;
    objects: {
        name: string;
        id: string;
        className?: string | undefined;
        slots?: {
            name: string;
            value: string;
        }[] | undefined;
    }[];
    links: {
        id: string;
        sourceId: string;
        targetId: string;
        name?: string | undefined;
    }[];
    projectName?: string | undefined;
}>;
export type GenerateObjectDiagramInput = z.infer<typeof GenerateObjectDiagramSchema>;
export type ObjectEntity = z.infer<typeof ObjectEntitySchema>;
export type ObjectLink = z.infer<typeof ObjectLinkSchema>;
export declare const CommLifelineSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    representClass: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    representClass?: string | undefined;
}, {
    name: string;
    id: string;
    representClass?: string | undefined;
}>;
export declare const CommMessageSchema: z.ZodObject<{
    id: z.ZodString;
    sourceId: z.ZodString;
    targetId: z.ZodString;
    sequenceNumber: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    sourceId: string;
    targetId: string;
    sequenceNumber: string;
}, {
    name: string;
    id: string;
    sourceId: string;
    targetId: string;
    sequenceNumber: string;
}>;
export declare const GenerateCommunicationDiagramSchema: z.ZodObject<{
    filePath: z.ZodEffects<z.ZodString, string, string>;
    projectName: z.ZodOptional<z.ZodString>;
    diagramName: z.ZodString;
    lifelines: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        representClass: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        representClass?: string | undefined;
    }, {
        name: string;
        id: string;
        representClass?: string | undefined;
    }>, "many">;
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sourceId: z.ZodString;
        targetId: z.ZodString;
        sequenceNumber: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        sourceId: string;
        targetId: string;
        sequenceNumber: string;
    }, {
        name: string;
        id: string;
        sourceId: string;
        targetId: string;
        sequenceNumber: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    diagramName: string;
    lifelines: {
        name: string;
        id: string;
        representClass?: string | undefined;
    }[];
    messages: {
        name: string;
        id: string;
        sourceId: string;
        targetId: string;
        sequenceNumber: string;
    }[];
    projectName?: string | undefined;
}, {
    filePath: string;
    diagramName: string;
    lifelines: {
        name: string;
        id: string;
        representClass?: string | undefined;
    }[];
    messages: {
        name: string;
        id: string;
        sourceId: string;
        targetId: string;
        sequenceNumber: string;
    }[];
    projectName?: string | undefined;
}>;
export type GenerateCommunicationDiagramInput = z.infer<typeof GenerateCommunicationDiagramSchema>;
export type CommLifeline = z.infer<typeof CommLifelineSchema>;
export type CommMessage = z.infer<typeof CommMessageSchema>;
export interface StarUMLRef {
    $ref: string;
}
export interface StarUMLNode {
    _type: string;
    _id: string;
    _parent?: StarUMLRef;
    name?: string;
    [key: string]: unknown;
}
