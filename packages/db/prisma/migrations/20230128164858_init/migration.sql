-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT,
    "publicKey" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Host" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEventsFile" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "cId" TEXT NOT NULL,
    "dealId" TEXT,
    "size" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metadataCId" TEXT NOT NULL,

    CONSTRAINT "UserEventsFile_pkey" PRIMARY KEY ("tokenId")
);

-- CreateTable
CREATE TABLE "UserEventsFileHostCount" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "hostName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "UserEventsFileHostCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HostToUserEventsFile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Host_name_key" ON "Host"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserEventsFile_tokenId_key" ON "UserEventsFile"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEventsFile_cId_key" ON "UserEventsFile"("cId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEventsFile_dealId_key" ON "UserEventsFile"("dealId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEventsFile_metadataCId_key" ON "UserEventsFile"("metadataCId");

-- CreateIndex
CREATE UNIQUE INDEX "_HostToUserEventsFile_AB_unique" ON "_HostToUserEventsFile"("A", "B");

-- CreateIndex
CREATE INDEX "_HostToUserEventsFile_B_index" ON "_HostToUserEventsFile"("B");

-- AddForeignKey
ALTER TABLE "UserEventsFile" ADD CONSTRAINT "UserEventsFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEventsFileHostCount" ADD CONSTRAINT "UserEventsFileHostCount_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "UserEventsFile"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEventsFileHostCount" ADD CONSTRAINT "UserEventsFileHostCount_hostName_fkey" FOREIGN KEY ("hostName") REFERENCES "Host"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEventsFileHostCount" ADD CONSTRAINT "UserEventsFileHostCount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HostToUserEventsFile" ADD CONSTRAINT "_HostToUserEventsFile_A_fkey" FOREIGN KEY ("A") REFERENCES "Host"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HostToUserEventsFile" ADD CONSTRAINT "_HostToUserEventsFile_B_fkey" FOREIGN KEY ("B") REFERENCES "UserEventsFile"("tokenId") ON DELETE CASCADE ON UPDATE CASCADE;
