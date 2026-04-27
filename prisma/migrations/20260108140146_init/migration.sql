-- CreateTable
CREATE TABLE "Prompt" (
    "id" TEXT NOT NULL,
    "tweetUrl" TEXT,
    "tweetId" TEXT,
    "promptText" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "author" TEXT,
    "authorHandle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "localPath" TEXT,
    "thumbnailPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prompt_tweetId_key" ON "Prompt"("tweetId");

-- CreateIndex
CREATE INDEX "Prompt_createdAt_idx" ON "Prompt"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Prompt_tweetId_idx" ON "Prompt"("tweetId");

-- CreateIndex
CREATE INDEX "Media_promptId_idx" ON "Media"("promptId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
