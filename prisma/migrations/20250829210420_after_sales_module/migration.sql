-- CreateEnum
CREATE TYPE "public"."BondStatus" AS ENUM ('RENEWED', 'NOT_RENEWED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."CheckStatus" AS ENUM ('REPLACEMENT', 'COLLECTED', 'CANCELLED', 'EXTENDED', 'PENDING');

-- CreateTable
CREATE TABLE "public"."bonds" (
    "id" SERIAL NOT NULL,
    "month" VARCHAR(50) NOT NULL,
    "bond_number" VARCHAR(255) NOT NULL,
    "status" "public"."BondStatus" NOT NULL DEFAULT 'NOT_RENEWED',
    "issue_date" TIMESTAMP(3) NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "entity_name" VARCHAR(255) NOT NULL,
    "insurer" VARCHAR(255) NOT NULL,
    "bond_type" VARCHAR(100) NOT NULL,
    "bond_amount" DECIMAL(15,2) NOT NULL,
    "project_description" TEXT NOT NULL,
    "company" VARCHAR(255) NOT NULL,
    "consortium" VARCHAR(255) NOT NULL,
    "financial_entity" VARCHAR(255) NOT NULL,
    "contact_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "executive" VARCHAR(255) NOT NULL,
    "note" TEXT NOT NULL,
    "premium" DECIMAL(15,2) NOT NULL,
    "invoice_due_date" TIMESTAMP(3) NOT NULL,
    "bond_nature" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bonds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checks" (
    "id" SERIAL NOT NULL,
    "entry_date" TIMESTAMP(3) NOT NULL,
    "check_number" VARCHAR(100) NOT NULL,
    "bond_number" VARCHAR(255) NOT NULL,
    "bond_type" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "company" VARCHAR(255) NOT NULL,
    "bank" VARCHAR(255) NOT NULL,
    "insurer" VARCHAR(255) NOT NULL,
    "status" "public"."CheckStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."releases" (
    "id" SERIAL NOT NULL,
    "presentation_date" TIMESTAMP(3) NOT NULL,
    "policy_number" TEXT NOT NULL,
    "refund_amount" DECIMAL(15,2) NOT NULL,
    "bond_type" TEXT NOT NULL,
    "applicant" VARCHAR(255) NOT NULL,
    "company_consortium" TEXT NOT NULL,
    "refund_date" TIMESTAMP(3) NOT NULL,
    "insurer" VARCHAR(255) NOT NULL,
    "notes" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "releases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bonds_status_idx" ON "public"."bonds"("status");

-- CreateIndex
CREATE INDEX "bonds_company_idx" ON "public"."bonds"("company");

-- CreateIndex
CREATE INDEX "bonds_bond_number_idx" ON "public"."bonds"("bond_number");

-- CreateIndex
CREATE INDEX "checks_status_idx" ON "public"."checks"("status");

-- CreateIndex
CREATE INDEX "checks_company_idx" ON "public"."checks"("company");

-- CreateIndex
CREATE INDEX "releases_policy_number_idx" ON "public"."releases"("policy_number");

-- CreateIndex
CREATE INDEX "releases_company_consortium_idx" ON "public"."releases"("company_consortium");
