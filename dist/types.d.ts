import { z } from "zod";
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
    filePath: z.ZodString;
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
    filePath: z.ZodString;
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
    filePath: z.ZodString;
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
    filePath: z.ZodString;
}, "strip", z.ZodTypeAny, {
    filePath: string;
}, {
    filePath: string;
}>;
export type InspectMdjModelInput = z.infer<typeof InspectMdjModelSchema>;
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
