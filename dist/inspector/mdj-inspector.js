import fs from "node:fs/promises";
/**
 * Inspects an existing StarUML (.mdj) file and returns a concise structural overview.
 */
export async function inspectMdjFile(filePath) {
    let stats;
    try {
        stats = await fs.stat(filePath);
    }
    catch (err) {
        const error = err;
        if (error.code === "ENOENT") {
            throw new Error(`File does not exist: "${filePath}"`);
        }
        throw new Error(`Cannot access file "${filePath}": ${error.message}`);
    }
    if (stats.isDirectory()) {
        throw new Error(`Target path is a directory, not a file: "${filePath}"`);
    }
    let content;
    try {
        content = await fs.readFile(filePath, "utf-8");
    }
    catch (err) {
        throw new Error(`Failed to read file "${filePath}": ${err.message}`);
    }
    let root;
    try {
        root = JSON.parse(content);
    }
    catch (err) {
        throw new Error(`Failed to parse StarUML .mdj file: ${err.message}`);
    }
    const allElements = new Map();
    collectAllElements(root, allElements);
    const diagrams = [];
    const classes = [];
    const actors = [];
    const useCases = [];
    const interactions = [];
    const relationships = [];
    for (const elem of allElements.values()) {
        const type = elem._type;
        if (type.endsWith("Diagram")) {
            const views = Array.isArray(elem.ownedViews) ? elem.ownedViews : [];
            diagrams.push({
                id: elem._id,
                name: elem.name ?? "Unnamed Diagram",
                type,
                viewsCount: views.length
            });
        }
        else if (type === "UMLClass" || type === "UMLInterface" || type === "UMLDataType" || type === "UMLEnumeration") {
            const attributes = [];
            if (Array.isArray(elem.attributes)) {
                for (const a of elem.attributes) {
                    attributes.push({
                        name: a.name ?? "unnamed",
                        type: a.type ?? "void",
                        visibility: a.visibility ?? "public"
                    });
                }
            }
            const operations = [];
            if (Array.isArray(elem.operations)) {
                for (const op of elem.operations) {
                    const params = [];
                    let retType;
                    if (Array.isArray(op.parameters)) {
                        for (const p of op.parameters) {
                            if (p.direction === "return") {
                                retType = p.type;
                            }
                            else {
                                params.push({ name: p.name ?? "", type: p.type ?? "" });
                            }
                        }
                    }
                    operations.push({
                        name: op.name ?? "unnamed",
                        returnType: retType,
                        visibility: op.visibility ?? "public",
                        parameters: params
                    });
                }
            }
            classes.push({
                id: elem._id,
                name: elem.name ?? "Unnamed",
                type,
                stereotype: elem.stereotype,
                isAbstract: !!elem.isAbstract,
                attributes,
                operations
            });
        }
        else if (type === "UMLActor") {
            actors.push({
                id: elem._id,
                name: elem.name ?? "Unnamed Actor"
            });
        }
        else if (type === "UMLUseCase") {
            useCases.push({
                id: elem._id,
                name: elem.name ?? "Unnamed Use Case"
            });
        }
        else if (type === "UMLInteraction") {
            const lifelines = [];
            if (Array.isArray(elem.participants)) {
                for (const p of elem.participants) {
                    lifelines.push({ id: p._id, name: p.name ?? "Unnamed Lifeline" });
                }
            }
            const messages = [];
            if (Array.isArray(elem.messages)) {
                for (const m of elem.messages) {
                    const srcRef = m.source;
                    const tgtRef = m.target;
                    const srcId = srcRef?.$ref;
                    const tgtId = tgtRef?.$ref;
                    const srcNode = srcId ? allElements.get(srcId) : undefined;
                    const tgtNode = tgtId ? allElements.get(tgtId) : undefined;
                    messages.push({
                        id: m._id,
                        name: m.name ?? "unnamed",
                        source: srcNode?.name ?? srcId ?? "unknown",
                        target: tgtNode?.name ?? tgtId ?? "unknown",
                        messageSort: m.messageSort
                    });
                }
            }
            interactions.push({
                id: elem._id,
                name: elem.name ?? "Unnamed Interaction",
                lifelines,
                messages
            });
        }
        else if (type === "UMLGeneralization" ||
            type === "UMLInterfaceRealization" ||
            type === "UMLDependency" ||
            type === "UMLInclude" ||
            type === "UMLExtend") {
            const srcRef = elem.source;
            const tgtRef = elem.target;
            const srcId = srcRef?.$ref;
            const tgtId = tgtRef?.$ref;
            const srcNode = srcId ? allElements.get(srcId) : undefined;
            const tgtNode = tgtId ? allElements.get(tgtId) : undefined;
            let relType = type.replace("UML", "").toLowerCase();
            if (type === "UMLInterfaceRealization") {
                relType = "realization";
            }
            relationships.push({
                id: elem._id,
                type: relType,
                name: elem.name,
                source: srcNode?.name ?? srcId ?? "unknown",
                target: tgtNode?.name ?? tgtId ?? "unknown"
            });
        }
        else if (type === "UMLAssociation") {
            const end1 = elem.end1;
            const end2 = elem.end2;
            const end1Ref = end1?.reference;
            const end2Ref = end2?.reference;
            const srcId = end1Ref?.$ref;
            const tgtId = end2Ref?.$ref;
            const srcNode = srcId ? allElements.get(srcId) : undefined;
            const tgtNode = tgtId ? allElements.get(tgtId) : undefined;
            let agg = end1?.aggregation;
            if (!agg || agg === "none") {
                agg = end2?.aggregation;
            }
            relationships.push({
                id: elem._id,
                type: agg === "composite" ? "composition" : agg === "shared" ? "aggregation" : "association",
                name: elem.name,
                source: srcNode?.name ?? srcId ?? "unknown",
                target: tgtNode?.name ?? tgtId ?? "unknown",
                sourceMultiplicity: end1?.multiplicity,
                targetMultiplicity: end2?.multiplicity,
                aggregation: agg
            });
        }
    }
    const totalClasses = classes.filter((c) => c.type === "UMLClass").length;
    const totalInterfaces = classes.filter((c) => c.type === "UMLInterface" || c.stereotype?.toLowerCase() === "interface").length;
    const totalAttributes = classes.reduce((acc, c) => acc + c.attributes.length, 0);
    const totalOperations = classes.reduce((acc, c) => acc + c.operations.length, 0);
    const totalLifelines = interactions.reduce((acc, i) => acc + i.lifelines.length, 0);
    const totalMessages = interactions.reduce((acc, i) => acc + i.messages.length, 0);
    const summary = {
        totalDiagrams: diagrams.length,
        totalClasses,
        totalInterfaces,
        totalAttributes,
        totalOperations,
        totalRelationships: relationships.length,
        totalActors: actors.length,
        totalUseCases: useCases.length,
        totalLifelines,
        totalMessages
    };
    const overviewMarkdown = generateMarkdownReport(root.name ?? "Untitled Project", filePath, {
        diagrams,
        classes,
        actors,
        useCases,
        interactions,
        relationships,
        summary
    });
    return {
        projectName: root.name ?? "Untitled Project",
        filePath,
        diagrams,
        classes,
        actors,
        useCases,
        interactions,
        relationships,
        summary,
        overviewMarkdown
    };
}
function collectAllElements(node, map) {
    if (!node || typeof node !== "object")
        return;
    if (node._id) {
        map.set(node._id, node);
    }
    for (const key of Object.keys(node)) {
        const val = node[key];
        if (Array.isArray(val)) {
            for (const item of val) {
                if (item && typeof item === "object" && item._type && item._id) {
                    collectAllElements(item, map);
                }
            }
        }
        else if (val && typeof val === "object" && val._type && val._id) {
            collectAllElements(val, map);
        }
    }
}
function generateMarkdownReport(projectName, filePath, data) {
    const lines = [];
    lines.push(`# StarUML Model Overview: ${projectName}`);
    lines.push(`**File:** \`${filePath}\`\n`);
    lines.push("## Summary Statistics");
    lines.push(`- **Diagrams:** ${data.summary.totalDiagrams}`);
    lines.push(`- **Classes:** ${data.summary.totalClasses}`);
    lines.push(`- **Interfaces:** ${data.summary.totalInterfaces}`);
    lines.push(`- **Attributes:** ${data.summary.totalAttributes}`);
    lines.push(`- **Operations / Methods:** ${data.summary.totalOperations}`);
    lines.push(`- **Relationships:** ${data.summary.totalRelationships}`);
    if (data.summary.totalActors > 0 || data.summary.totalUseCases > 0) {
        lines.push(`- **Actors:** ${data.summary.totalActors}`);
        lines.push(`- **Use Cases:** ${data.summary.totalUseCases}`);
    }
    if (data.summary.totalLifelines > 0 || data.summary.totalMessages > 0) {
        lines.push(`- **Lifelines:** ${data.summary.totalLifelines}`);
        lines.push(`- **Interaction Messages:** ${data.summary.totalMessages}`);
    }
    lines.push("");
    if (data.diagrams.length > 0) {
        lines.push("## Diagrams");
        for (const d of data.diagrams) {
            lines.push(`- **${d.name}** (\`${d.type}\`) — ${d.viewsCount} visual views`);
        }
        lines.push("");
    }
    if (data.classes.length > 0) {
        lines.push("## Classes & Interfaces");
        for (const cls of data.classes) {
            const stereoTag = cls.stereotype ? ` «${cls.stereotype}»` : "";
            const abstractTag = cls.isAbstract ? " *(abstract)*" : "";
            lines.push(`### ${cls.name}${stereoTag}${abstractTag} (\`${cls.type}\`)`);
            if (cls.attributes.length > 0) {
                lines.push("**Attributes:**");
                for (const attr of cls.attributes) {
                    lines.push(`  - \`${attr.visibility ?? "public"}\` **${attr.name}**: ${attr.type}`);
                }
            }
            if (cls.operations.length > 0) {
                lines.push("**Operations:**");
                for (const op of cls.operations) {
                    const paramStr = op.parameters.map((p) => `${p.name}: ${p.type}`).join(", ");
                    const retStr = op.returnType ? `: ${op.returnType}` : "";
                    lines.push(`  - \`${op.visibility ?? "public"}\` **${op.name}**(${paramStr})${retStr}`);
                }
            }
            lines.push("");
        }
    }
    if (data.relationships.length > 0) {
        lines.push("## Relationships");
        for (const r of data.relationships) {
            const label = r.name ? ` "${r.name}"` : "";
            const mult = r.sourceMultiplicity || r.targetMultiplicity
                ? ` [${r.sourceMultiplicity ?? ""} -> ${r.targetMultiplicity ?? ""}]`
                : "";
            lines.push(`- **${r.source}** ──(${r.type}${label}${mult})──> **${r.target}**`);
        }
        lines.push("");
    }
    if (data.actors.length > 0 || data.useCases.length > 0) {
        lines.push("## Use Case Entities");
        if (data.actors.length > 0) {
            lines.push(`- **Actors:** ${data.actors.map((a) => a.name).join(", ")}`);
        }
        if (data.useCases.length > 0) {
            lines.push(`- **Use Cases:** ${data.useCases.map((u) => u.name).join(", ")}`);
        }
        lines.push("");
    }
    if (data.interactions.length > 0) {
        lines.push("## Sequence Interactions");
        for (const inter of data.interactions) {
            lines.push(`### Interaction: ${inter.name}`);
            lines.push(`- **Participants:** ${inter.lifelines.map((l) => l.name).join(", ")}`);
            lines.push("- **Chronological Messages:**");
            for (const m of inter.messages) {
                lines.push(`  1. \`${m.source}\` ──[${m.name} (${m.messageSort ?? "synchCall"})]──> \`${m.target}\``);
            }
            lines.push("");
        }
    }
    return lines.join("\n");
}
//# sourceMappingURL=mdj-inspector.js.map