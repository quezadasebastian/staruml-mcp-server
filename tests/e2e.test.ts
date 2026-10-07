import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { buildClassDiagramMdj, buildUseCaseDiagramMdj, buildSequenceDiagramMdj } from "../src/staruml/mdj-builder.js";
import { inspectMdjFile } from "../src/inspector/mdj-inspector.js";
import { writeAtomicJson } from "../src/utils/file-writer.js";
import { isValidStarUMLId, generateStarUMLId } from "../src/staruml/id-generator.js";
import type { GenerateClassDiagramInput, GenerateUseCaseDiagramInput, GenerateSequenceDiagramInput } from "../src/types.js";

const TEST_OUTPUT_DIR = path.resolve("./tests/output");

describe("StarUML MCP Server E2E Test Suite", () => {
  beforeAll(async () => {
    await fs.mkdir(TEST_OUTPUT_DIR, { recursive: true });
  });

  afterAll(async () => {
    // Keep generated output files for inspection or remove if needed
  });

  it("should generate valid 24-character Base64-style StarUML IDs", () => {
    const id1 = generateStarUMLId();
    const id2 = generateStarUMLId();

    expect(id1).toHaveLength(24);
    expect(id2).toHaveLength(24);
    expect(id1).not.toBe(id2);
    expect(isValidStarUMLId(id1)).toBe(true);
    expect(isValidStarUMLId(id2)).toBe(true);
  });

  it("should generate a complex Class Diagram with at least 6 classes, inheritance, composition, and realization", async () => {
    const filePath = path.join(TEST_OUTPUT_DIR, "ecommerce_architecture.mdj");

    const classDiagramInput: GenerateClassDiagramInput = {
      filePath,
      projectName: "E-Commerce Enterprise Architecture",
      diagramName: "Domain Model & Services",
      classes: [
        {
          id: "cls_user",
          name: "User",
          stereotype: "abstract",
          attributes: [
            { name: "id", type: "string", visibility: "protected" },
            { name: "email", type: "string", visibility: "public" },
            { name: "createdAt", type: "Date", visibility: "protected" }
          ],
          operations: [
            {
              name: "authenticate",
              returnType: "boolean",
              visibility: "public",
              parameters: [{ name: "password", type: "string" }]
            }
          ]
        },
        {
          id: "cls_customer",
          name: "Customer",
          attributes: [
            { name: "loyaltyPoints", type: "number", visibility: "private" },
            { name: "shippingAddress", type: "string", visibility: "public" }
          ],
          operations: [
            {
              name: "applyDiscount",
              returnType: "number",
              visibility: "public",
              parameters: [{ name: "code", type: "string" }]
            }
          ]
        },
        {
          id: "cls_order",
          name: "Order",
          attributes: [
            { name: "orderId", type: "string", visibility: "public" },
            { name: "status", type: "OrderStatus", visibility: "public" },
            { name: "totalAmount", type: "number", visibility: "private" }
          ],
          operations: [
            {
              name: "calculateTotal",
              returnType: "number",
              visibility: "public"
            },
            {
              name: "checkout",
              returnType: "boolean",
              visibility: "public"
            }
          ]
        },
        {
          id: "cls_order_item",
          name: "OrderItem",
          attributes: [
            { name: "sku", type: "string", visibility: "public" },
            { name: "quantity", type: "number", visibility: "public" },
            { name: "unitPrice", type: "number", visibility: "public" }
          ],
          operations: [
            {
              name: "getSubtotal",
              returnType: "number",
              visibility: "public"
            }
          ]
        },
        {
          id: "iface_payment_gateway",
          name: "IPaymentGateway",
          stereotype: "interface",
          operations: [
            {
              name: "processPayment",
              returnType: "PaymentResult",
              visibility: "public",
              parameters: [
                { name: "amount", type: "number" },
                { name: "currency", type: "string" }
              ]
            },
            {
              name: "refund",
              returnType: "boolean",
              visibility: "public",
              parameters: [{ name: "transactionId", type: "string" }]
            }
          ]
        },
        {
          id: "cls_stripe_gateway",
          name: "StripePaymentGateway",
          attributes: [
            { name: "apiKey", type: "string", visibility: "private" },
            { name: "webhookSecret", type: "string", visibility: "private" }
          ],
          operations: [
            {
              name: "processPayment",
              returnType: "PaymentResult",
              visibility: "public",
              parameters: [
                { name: "amount", type: "number" },
                { name: "currency", type: "string" }
              ]
            },
            {
              name: "refund",
              returnType: "boolean",
              visibility: "public",
              parameters: [{ name: "transactionId", type: "string" }]
            }
          ]
        },
        {
          id: "cls_invoice",
          name: "Invoice",
          attributes: [
            { name: "invoiceNumber", type: "string", visibility: "public" },
            { name: "issuedAt", type: "Date", visibility: "public" },
            { name: "paid", type: "boolean", visibility: "public" }
          ],
          operations: [
            {
              name: "sendToCustomer",
              returnType: "void",
              visibility: "public"
            }
          ]
        }
      ],
      relationships: [
        // 1. Inheritance: Customer extends User
        {
          id: "rel_gen_customer_user",
          type: "generalization",
          sourceId: "cls_customer",
          targetId: "cls_user"
        },
        // 2. Realization: StripePaymentGateway implements IPaymentGateway
        {
          id: "rel_real_stripe_gateway",
          type: "realization",
          sourceId: "cls_stripe_gateway",
          targetId: "iface_payment_gateway"
        },
        // 3. Composition: Order contains OrderItems (Order owns OrderItem)
        {
          id: "rel_comp_order_items",
          type: "composition",
          sourceId: "cls_order",
          targetId: "cls_order_item",
          name: "items",
          sourceMultiplicity: "1",
          targetMultiplicity: "1..*"
        },
        // 4. Aggregation: Customer has Orders
        {
          id: "rel_agg_customer_orders",
          type: "aggregation",
          sourceId: "cls_customer",
          targetId: "cls_order",
          name: "placedOrders",
          sourceMultiplicity: "1",
          targetMultiplicity: "0..*"
        },
        // 5. Association: Order generates Invoice
        {
          id: "rel_assoc_order_invoice",
          type: "association",
          sourceId: "cls_order",
          targetId: "cls_invoice",
          name: "generates",
          sourceMultiplicity: "1",
          targetMultiplicity: "1"
        },
        // 6. Dependency: Order depends on IPaymentGateway
        {
          id: "rel_dep_order_payment",
          type: "dependency",
          sourceId: "cls_order",
          targetId: "iface_payment_gateway",
          name: "uses"
        }
      ]
    };

    const mdjAst = buildClassDiagramMdj(classDiagramInput);
    await writeAtomicJson(filePath, mdjAst);

    // Verify written file exists and parse it
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(fileContent);

    expect(parsed._type).toBe("Project");
    expect(parsed.name).toBe("E-Commerce Enterprise Architecture");
    expect(parsed.ownedElements).toHaveLength(1);

    const model = parsed.ownedElements[0];
    expect(model._type).toBe("UMLModel");

    const diagram = model.ownedElements.find((e: any) => e._type === "UMLClassDiagram");
    expect(diagram).toBeDefined();
    expect(diagram.name).toBe("Domain Model & Services");

    // Check that all 7 classes/interfaces exist in semantic model
    const semanticEntities = model.ownedElements.filter(
      (e: any) => e._type === "UMLClass" || e._type === "UMLInterface"
    );
    expect(semanticEntities).toHaveLength(7);

    // Check that views exist for each class
    const views = diagram.ownedViews;
    const classViews = views.filter(
      (v: any) => v._type === "UMLClassView" || v._type === "UMLInterfaceView"
    );
    expect(classViews).toHaveLength(7);

    // Verify views have valid Dagre spatial positions (no zeros, no overlaps)
    for (const cv of classViews) {
      expect(cv.left).toBeGreaterThanOrEqual(0);
      expect(cv.top).toBeGreaterThanOrEqual(0);
      expect(cv.width).toBeGreaterThan(100);
      expect(cv.height).toBeGreaterThan(50);
      expect(cv.nameCompartment).toBeDefined();
      expect(cv.attributeCompartment).toBeDefined();
      expect(cv.operationCompartment).toBeDefined();
    }

    // Check relationship views (generalization, realization, association, dependency)
    const relViews = views.filter(
      (v: any) =>
        v._type === "UMLGeneralizationView" ||
        v._type === "UMLInterfaceRealizationView" ||
        v._type === "UMLDependencyView" ||
        v._type === "UMLAssociationView"
    );
    expect(relViews).toHaveLength(6);

    for (const rv of relViews) {
      expect(rv.head?.$ref).toBeDefined();
      expect(rv.tail?.$ref).toBeDefined();
      expect(rv.points).toMatch(/^\d+:\d+(;\d+:\d+)+$/);
    }
  });

  it("should generate a valid Use Case Diagram with actors, use cases, boundaries, and relationships", async () => {
    const filePath = path.join(TEST_OUTPUT_DIR, "online_store_usecases.mdj");

    const useCaseInput: GenerateUseCaseDiagramInput = {
      filePath,
      projectName: "Online Shopping Use Case Model",
      diagramName: "Core Store Operations",
      actors: [
        { id: "act_customer", name: "Shopper" },
        { id: "act_admin", name: "Store Admin" }
      ],
      useCases: [
        { id: "uc_browse", name: "Browse Products", systemBoundary: "Storefront" },
        { id: "uc_cart", name: "Manage Cart", systemBoundary: "Storefront" },
        { id: "uc_checkout", name: "Checkout & Pay", systemBoundary: "Storefront" },
        { id: "uc_inventory", name: "Update Inventory", systemBoundary: "Backoffice" },
        { id: "uc_reports", name: "View Sales Reports", systemBoundary: "Backoffice" }
      ],
      relationships: [
        { id: "rel_act_browse", type: "association", sourceId: "act_customer", targetId: "uc_browse" },
        { id: "rel_act_cart", type: "association", sourceId: "act_customer", targetId: "uc_cart" },
        { id: "rel_cart_checkout", type: "include", sourceId: "uc_cart", targetId: "uc_checkout" },
        { id: "rel_admin_inv", type: "association", sourceId: "act_admin", targetId: "uc_inventory" },
        { id: "rel_admin_rep", type: "association", sourceId: "act_admin", targetId: "uc_reports" }
      ]
    };

    const mdjAst = buildUseCaseDiagramMdj(useCaseInput);
    await writeAtomicJson(filePath, mdjAst);

    const parsed = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const model = parsed.ownedElements[0];
    const diagram = model.ownedElements.find((e: any) => e._type === "UMLUseCaseDiagram");
    expect(diagram).toBeDefined();

    // Verify system boundary views were generated and linked to semantic subjects
    const boundaryViews = diagram.ownedViews.filter((v: any) => v._type === "UMLUseCaseSubjectView");
    expect(boundaryViews).toHaveLength(2);
    const semanticSubjects = model.ownedElements.filter((e: any) => e._type === "UMLUseCaseSubject");
    expect(semanticSubjects).toHaveLength(2);
    for (const bv of boundaryViews) {
      expect(bv.model?.$ref).toBeDefined();
      expect(semanticSubjects.some((s: any) => s._id === bv.model.$ref)).toBe(true);
    }

    // Verify actor views and use case views
    const actorViews = diagram.ownedViews.filter((v: any) => v._type === "UMLActorView");
    const ucViews = diagram.ownedViews.filter((v: any) => v._type === "UMLUseCaseView");
    expect(actorViews).toHaveLength(2);
    expect(ucViews).toHaveLength(5);

    // Verify association views have all 11 subviews and end references
    const assocViews = diagram.ownedViews.filter((v: any) => v._type === "UMLAssociationView");
    expect(assocViews).toHaveLength(4);
    for (const av of assocViews) {
      expect(av.subViews).toHaveLength(11);
      expect(av.tailRoleNameLabel?.$ref).toBeDefined();
      expect(av.headRoleNameLabel?.$ref).toBeDefined();
      expect(av.tailMultiplicityLabel?.$ref).toBeDefined();
      expect(av.headMultiplicityLabel?.$ref).toBeDefined();
      expect(av.tailQualifiersCompartment?.$ref).toBeDefined();
      expect(av.headQualifiersCompartment?.$ref).toBeDefined();
    }

    // Verify include view has «include» stereotype
    const includeViews = diagram.ownedViews.filter((v: any) => v._type === "UMLIncludeView");
    expect(includeViews).toHaveLength(1);
    expect(includeViews[0].points).toMatch(/^\d+:\d+(;\d+:\d+)+$/);
  });

  it("should generate a valid Sequence Diagram with chronological message vertical ordering", async () => {
    const filePath = path.join(TEST_OUTPUT_DIR, "order_placement_sequence.mdj");

    const seqInput: GenerateSequenceDiagramInput = {
      filePath,
      projectName: "Order System Interaction",
      diagramName: "Order Placement Flow",
      lifelines: [
        { id: "ll_client", name: "WebBrowser" },
        { id: "ll_api", name: "APIGateway" },
        { id: "ll_order_service", name: "OrderService" },
        { id: "ll_payment_service", name: "PaymentGateway" },
        { id: "ll_db", name: "Database" }
      ],
      messages: [
        {
          id: "msg_1",
          name: "POST /orders",
          sourceLifelineId: "ll_client",
          targetLifelineId: "ll_api",
          messageSort: "synchCall"
        },
        {
          id: "msg_2",
          name: "createOrder(payload)",
          sourceLifelineId: "ll_api",
          targetLifelineId: "ll_order_service",
          messageSort: "synchCall"
        },
        {
          id: "msg_3",
          name: "authorizePayment(amount)",
          sourceLifelineId: "ll_order_service",
          targetLifelineId: "ll_payment_service",
          messageSort: "synchCall"
        },
        {
          id: "msg_4",
          name: "PaymentAuthorized",
          sourceLifelineId: "ll_payment_service",
          targetLifelineId: "ll_order_service",
          messageSort: "reply"
        },
        {
          id: "msg_5",
          name: "INSERT INTO orders",
          sourceLifelineId: "ll_order_service",
          targetLifelineId: "ll_db",
          messageSort: "synchCall"
        },
        {
          id: "msg_6",
          name: "sendConfirmationEmail()",
          sourceLifelineId: "ll_order_service",
          targetLifelineId: "ll_order_service",
          messageSort: "asynchCall"
        },
        {
          id: "msg_7",
          name: "201 Created (OrderDetails)",
          sourceLifelineId: "ll_order_service",
          targetLifelineId: "ll_client",
          messageSort: "reply"
        }
      ]
    };

    const mdjAst = buildSequenceDiagramMdj(seqInput);
    await writeAtomicJson(filePath, mdjAst);

    const parsed = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const model = parsed.ownedElements[0];
    const interaction = model.ownedElements.find((e: any) => e._type === "UMLInteraction");
    expect(interaction).toBeDefined();
    expect(interaction.participants).toHaveLength(5);
    expect(interaction.messages).toHaveLength(7);

    const diagram = interaction.ownedElements.find((e: any) => e._type === "UMLSequenceDiagram");
    expect(diagram).toBeDefined();

    const lifelineViews = diagram.ownedViews.filter((v: any) => v._type === "UMLSeqLifelineView");
    expect(lifelineViews).toHaveLength(5);

    // Verify lifelines are arranged horizontally from left to right
    for (let i = 0; i < lifelineViews.length - 1; i++) {
      expect(lifelineViews[i + 1].left).toBeGreaterThan(lifelineViews[i].left);
      expect(lifelineViews[i].lineCompartment).toBeDefined();
    }

    const messageViews = diagram.ownedViews.filter((v: any) => v._type === "UMLSeqMessageView");
    expect(messageViews).toHaveLength(7);

    // Verify messages have strictly descending Y coordinates (chronological order)
    const yCoordinates: number[] = messageViews.map((mv: any) => {
      const firstPt = mv.points.split(";")[0];
      return parseInt(firstPt.split(":")[1], 10);
    });

    for (let i = 0; i < yCoordinates.length - 1; i++) {
      expect(yCoordinates[i + 1]).toBeGreaterThan(yCoordinates[i]);
    }
  });

  it("should inspect an existing StarUML .mdj file and extract complete structural overview", async () => {
    const classFilePath = path.join(TEST_OUTPUT_DIR, "ecommerce_architecture.mdj");
    const result = await inspectMdjFile(classFilePath);

    expect(result.projectName).toBe("E-Commerce Enterprise Architecture");
    expect(result.summary.totalClasses).toBe(6);
    expect(result.summary.totalInterfaces).toBe(1);
    expect(result.summary.totalRelationships).toBe(6);
    expect(result.diagrams).toHaveLength(1);
    expect(result.diagrams[0].name).toBe("Domain Model & Services");

    // Verify User class
    const userClass = result.classes.find((c) => c.name === "User");
    expect(userClass).toBeDefined();
    expect(userClass?.attributes).toHaveLength(3);
    expect(userClass?.operations).toHaveLength(1);
    expect(userClass?.operations[0].name).toBe("authenticate");
    expect(userClass?.operations[0].parameters).toHaveLength(1);

    // Verify relationships in report
    const relStrings = result.relationships.map((r) => `${r.source} -> ${r.target} (${r.type})`);
    expect(relStrings).toContain("Customer -> User (generalization)");
    expect(relStrings).toContain("StripePaymentGateway -> IPaymentGateway (realization)");
    expect(relStrings).toContain("Order -> OrderItem (composition)");
    expect(relStrings).toContain("Customer -> Order (aggregation)");

    // Verify overview markdown content
    expect(result.overviewMarkdown).toContain("# StarUML Model Overview");
    expect(result.overviewMarkdown).toContain("Domain Model & Services");
    expect(result.overviewMarkdown).toContain("**Customer** ──(generalization)──> **User**");
  });
});
