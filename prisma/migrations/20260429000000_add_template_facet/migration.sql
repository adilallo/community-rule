-- CreateTable
CREATE TABLE "TemplateFacet" (
    "id" TEXT NOT NULL,
    "templateSlug" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "matches" BOOLEAN NOT NULL,

    CONSTRAINT "TemplateFacet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemplateFacet_templateSlug_group_value_key" ON "TemplateFacet"("templateSlug", "group", "value");

-- CreateIndex
CREATE INDEX "TemplateFacet_templateSlug_idx" ON "TemplateFacet"("templateSlug");

-- CreateIndex
CREATE INDEX "TemplateFacet_group_value_matches_idx" ON "TemplateFacet"("group", "value", "matches");
