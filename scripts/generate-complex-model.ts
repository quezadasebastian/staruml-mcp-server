import path from "node:path";
import { buildClassDiagramMdj } from "../src/staruml/mdj-builder.js";
import { inspectMdjFile } from "../src/inspector/mdj-inspector.js";
import { writeAtomicJson } from "../src/utils/file-writer.js";
import type { GenerateClassDiagramInput } from "../src/types.js";

async function main() {
  const outputPath = path.resolve("./output/complex_architecture.mdj");

  console.log("Generating complex StarUML architecture diagram...");

  const domainModel: GenerateClassDiagramInput = {
    filePath: outputPath,
    projectName: "Enterprise Banking & Payments System",
    diagramName: "Core Domain Architecture",
    classes: [
      {
        id: "entity_account",
        name: "BankAccount",
        stereotype: "abstract",
        attributes: [
          { name: "accountNumber", type: "string", visibility: "protected" },
          { name: "balance", type: "BigNumber", visibility: "protected" },
          { name: "openedAt", type: "Date", visibility: "protected" }
        ],
        operations: [
          {
            name: "deposit",
            returnType: "void",
            visibility: "public",
            parameters: [{ name: "amount", type: "BigNumber" }]
          },
          {
            name: "withdraw",
            returnType: "boolean",
            visibility: "public",
            parameters: [{ name: "amount", type: "BigNumber" }]
          }
        ]
      },
      {
        id: "entity_savings",
        name: "SavingsAccount",
        attributes: [
          { name: "interestRate", type: "number", visibility: "private" },
          { name: "minimumBalance", type: "BigNumber", visibility: "private" }
        ],
        operations: [
          {
            name: "accrueInterest",
            returnType: "BigNumber",
            visibility: "public"
          }
        ]
      },
      {
        id: "entity_customer",
        name: "BankCustomer",
        attributes: [
          { name: "customerId", type: "string", visibility: "public" },
          { name: "fullName", type: "string", visibility: "public" },
          { name: "taxId", type: "string", visibility: "protected" }
        ],
        operations: [
          {
            name: "getNetWorth",
            returnType: "BigNumber",
            visibility: "public"
          }
        ]
      },
      {
        id: "entity_transaction",
        name: "Transaction",
        attributes: [
          { name: "transactionId", type: "string", visibility: "public" },
          { name: "timestamp", type: "Date", visibility: "public" },
          { name: "amount", type: "BigNumber", visibility: "public" },
          { name: "status", type: "TransactionStatus", visibility: "public" }
        ],
        operations: [
          {
            name: "execute",
            returnType: "boolean",
            visibility: "public"
          }
        ]
      },
      {
        id: "iface_audit_logger",
        name: "IAuditLogger",
        stereotype: "interface",
        operations: [
          {
            name: "logEvent",
            returnType: "void",
            visibility: "public",
            parameters: [
              { name: "action", type: "string" },
              { name: "payload", type: "Record<string, unknown>" }
            ]
          }
        ]
      },
      {
        id: "service_audit_service",
        name: "CloudAuditService",
        attributes: [
          { name: "cloudRegion", type: "string", visibility: "private" },
          { name: "queueName", type: "string", visibility: "private" }
        ],
        operations: [
          {
            name: "logEvent",
            returnType: "void",
            visibility: "public",
            parameters: [
              { name: "action", type: "string" },
              { name: "payload", type: "Record<string, unknown>" }
            ]
          }
        ]
      },
      {
        id: "entity_statement",
        name: "AccountStatement",
        attributes: [
          { name: "periodStart", type: "Date", visibility: "public" },
          { name: "periodEnd", type: "Date", visibility: "public" },
          { name: "closingBalance", type: "BigNumber", visibility: "public" }
        ],
        operations: [
          {
            name: "exportPdf",
            returnType: "Buffer",
            visibility: "public"
          }
        ]
      }
    ],
    relationships: [
      // Inheritance: SavingsAccount extends BankAccount
      {
        id: "rel_gen_savings_account",
        type: "generalization",
        sourceId: "entity_savings",
        targetId: "entity_account"
      },
      // Realization: CloudAuditService implements IAuditLogger
      {
        id: "rel_real_audit_logger",
        type: "realization",
        sourceId: "service_audit_service",
        targetId: "iface_audit_logger"
      },
      // Composition: BankAccount has Transactions
      {
        id: "rel_comp_account_transactions",
        type: "composition",
        sourceId: "entity_account",
        targetId: "entity_transaction",
        name: "transactions",
        sourceMultiplicity: "1",
        targetMultiplicity: "0..*"
      },
      // Aggregation: BankCustomer owns BankAccounts
      {
        id: "rel_agg_customer_accounts",
        type: "aggregation",
        sourceId: "entity_customer",
        targetId: "entity_account",
        name: "accounts",
        sourceMultiplicity: "1",
        targetMultiplicity: "1..*"
      },
      // Association: BankAccount generates AccountStatement
      {
        id: "rel_assoc_account_statement",
        type: "association",
        sourceId: "entity_account",
        targetId: "entity_statement",
        name: "generates",
        sourceMultiplicity: "1",
        targetMultiplicity: "0..*"
      },
      // Dependency: Transaction uses IAuditLogger
      {
        id: "rel_dep_transaction_audit",
        type: "dependency",
        sourceId: "entity_transaction",
        targetId: "iface_audit_logger",
        name: "audits"
      }
    ]
  };

  const mdjAst = buildClassDiagramMdj(domainModel);
  await writeAtomicJson(outputPath, mdjAst);

  console.log(`Saved StarUML model to: ${outputPath}`);

  console.log("\nInspecting generated model...");
  const inspection = await inspectMdjFile(outputPath);
  console.log(inspection.overviewMarkdown);
}

main().catch((err) => {
  console.error("Error generating complex model:", err);
  process.exit(1);
});
