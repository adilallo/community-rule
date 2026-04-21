-- CreateTable
CREATE TABLE "MethodFacet" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "matches" BOOLEAN NOT NULL,
    "weight" DOUBLE PRECISION,

    CONSTRAINT "MethodFacet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MethodFacet_section_slug_group_value_key" ON "MethodFacet"("section", "slug", "group", "value");

-- CreateIndex
CREATE INDEX "MethodFacet_section_idx" ON "MethodFacet"("section");

-- CreateIndex
CREATE INDEX "MethodFacet_group_value_matches_idx" ON "MethodFacet"("group", "value", "matches");
