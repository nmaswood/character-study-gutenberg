-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "shortSummary" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "characterName" TEXT NOT NULL,
    "traits" TEXT[],
    "relationships" TEXT[],
    "goals" TEXT[],
    "quotes" TEXT[],
    "tone" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlotEvent" (
    "id" SERIAL NOT NULL,
    "eventSummary" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "PlotEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharactersOnEvents" (
    "characterId" INTEGER NOT NULL,
    "plotEventId" INTEGER NOT NULL,

    CONSTRAINT "CharactersOnEvents_pkey" PRIMARY KEY ("characterId","plotEventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_id_key" ON "Book"("id");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlotEvent" ADD CONSTRAINT "PlotEvent_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharactersOnEvents" ADD CONSTRAINT "CharactersOnEvents_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharactersOnEvents" ADD CONSTRAINT "CharactersOnEvents_plotEventId_fkey" FOREIGN KEY ("plotEventId") REFERENCES "PlotEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
