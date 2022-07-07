-- CreateEnum
CREATE TYPE "AnimeFormat" AS ENUM ('TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA');

-- CreateEnum
CREATE TYPE "AnimeStatus" AS ENUM ('FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS');

-- CreateEnum
CREATE TYPE "AnimeSeason" AS ENUM ('WINTER', 'SPRING', 'SUMMER', 'FALL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anime" (
    "id" SERIAL NOT NULL,
    "idAnilist" INTEGER NOT NULL,
    "idMal" INTEGER,
    "idAniDB" INTEGER,
    "idKitsu" INTEGER,
    "title" TEXT NOT NULL,
    "titleFrench" TEXT,
    "titleEnglish" TEXT,
    "titleRomaji" TEXT,
    "titleKanji" TEXT,
    "description" TEXT,
    "bannerImage" TEXT,
    "coverImage" TEXT,
    "format" "AnimeFormat",
    "duration" INTEGER,
    "status" "AnimeStatus",
    "releaseDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "season" "AnimeSeason",
    "seasonYear" INTEGER,
    "isAdult" BOOLEAN NOT NULL,
    "popularityAnilist" INTEGER,
    "scoreAnilist" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "coverImage" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "number" INTEGER NOT NULL,
    "arcName" TEXT,
    "airedDate" TIMESTAMP(3),
    "length" INTEGER,
    "isFiller" BOOLEAN NOT NULL DEFAULT false,
    "isRecap" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "animeId" INTEGER NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnimeToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Anime_idAnilist_key" ON "Anime"("idAnilist");

-- CreateIndex
CREATE UNIQUE INDEX "_AnimeToCategory_AB_unique" ON "_AnimeToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_AnimeToCategory_B_index" ON "_AnimeToCategory"("B");

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimeToCategory" ADD CONSTRAINT "_AnimeToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimeToCategory" ADD CONSTRAINT "_AnimeToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
