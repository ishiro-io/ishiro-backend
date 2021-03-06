import { Injectable } from "@nestjs/common";
import { Category, Prisma } from "@prisma/client";

import { PrismaService } from "./prisma.service";

const categories = [
  { name: "Comédie" },
  { name: "Fantasy" },
  { name: "Romance" },
  { name: "Action" },
  { name: "Vie à l'école" },
  { name: "Drame" },
  { name: "Aventure" },
  { name: "Tranche de vie" },
  { name: "Shojo" },
  { name: "Science-fiction" },
  { name: "Yaoi" },
  { name: "Ecchi" },
  { name: "Sports" },
  { name: "Historique" },
  { name: "Thriller" },
  { name: "Harem" },
  { name: "Mystère" },
  { name: "Magie" },
  { name: "Musique" },
  { name: "Horreur" },
  { name: "Mecha" },
  { name: "Psychologique" },
  { name: "Shonen" },
  { name: "Arts martiaux" },
  { name: "Super pouvoir" },
  { name: "Surnaturel" },
  { name: "Militaire" },
  { name: "Seinen" },
  { name: "Policier" },
  { name: "Josei" },
  { name: "Cuisine" },
  { name: "Yuri" },
];

const categoriesIdMap = new Map<string, number>();

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async initCategories(): Promise<Prisma.BatchPayload> {
    return this.prisma.category.createMany({ data: categories });
  }

  async categoryFromName(name: string) {
    const findCategoryIdFromName = async (name: string) => {
      let id = categoriesIdMap.get(name);

      if (!id) {
        id = await this.category({ where: {} }).then(
          (category) => category?.id
        );

        if (id) categoriesIdMap.set(name, id);
      }

      return id;
    };

    switch (name) {
      case "Comedy":
        return findCategoryIdFromName("Comédie");

      case "Fantasy":
        return findCategoryIdFromName("Fantasy");

      case "Romance":
        return findCategoryIdFromName("Romance");

      case "Action":
        return findCategoryIdFromName("Action");

      case "School":
      case "School Life":
      case "School Club":
        return findCategoryIdFromName("Vie à l'école");

      case "Drama":
        return findCategoryIdFromName("Drame");

      case "Adventure":
        return findCategoryIdFromName("Aventure");

      case "Slice of Life":
        return findCategoryIdFromName("Tranche de vie");

      case "Shoujo":
      case "Mahou Shoujo":
        return findCategoryIdFromName("Shojo");

      case "Sci-Fi":
      case "Space":
        return findCategoryIdFromName("Science-fiction");

      case "Yaoi":
      case "Shounen Ai":
        return findCategoryIdFromName("Yaoi");

      case "Shoujo Ai":
        return findCategoryIdFromName("Yuri");

      case "Ecchi":
        return findCategoryIdFromName("Ecchi");

      case "Sports":
        return findCategoryIdFromName("Sports");

      case "Historical":
        return findCategoryIdFromName("Historique");

      case "Thriller":
        return findCategoryIdFromName("Thriller");

      case "Harem":
      case "Reverse Harem":
        return findCategoryIdFromName("Harem");

      case "Mystery":
        return findCategoryIdFromName("Mystère");

      case "Magic":
        return findCategoryIdFromName("Magie");

      case "Horror":
        return findCategoryIdFromName("Horreur");

      case "Music":
        return findCategoryIdFromName("Musique");

      case "Mecha":
        return findCategoryIdFromName("Mecha");

      case "Psychological":
        return findCategoryIdFromName("Psychologique");

      case "Shounen":
        return findCategoryIdFromName("Shonen");

      case "Martial Arts":
        return findCategoryIdFromName("Arts martiaux");

      case "Super Power":
        return findCategoryIdFromName("Super pouvoir");

      case "Supernatural":
        return findCategoryIdFromName("Surnaturel");

      case "Military":
        return findCategoryIdFromName("Militaire");

      case "Seinen":
        return findCategoryIdFromName("Seinen");

      case "Police":
      case "Detective":
        return findCategoryIdFromName("Policier");

      case "Josei":
        return findCategoryIdFromName("Josei");

      case "Food":
      case "Cooking":
        return findCategoryIdFromName("Cuisine");

      default:
        return null;
    }
  }

  async category(args: Prisma.CategoryFindFirstArgs): Promise<Category | null> {
    return this.prisma.category.findFirst(args);
  }

  async categorys(args: Prisma.CategoryFindManyArgs): Promise<Category[]> {
    return this.prisma.category.findMany(args);
  }

  async createCategory(args: Prisma.CategoryCreateArgs): Promise<Category> {
    return this.prisma.category.create(args);
  }

  async updateCategory(args: Prisma.CategoryUpdateArgs): Promise<Category> {
    return this.prisma.category.update(args);
  }

  async deleteCategory(args: Prisma.CategoryDeleteArgs): Promise<Category> {
    return this.prisma.category.delete(args);
  }

  async deleteCategorys(
    args: Prisma.CategoryDeleteManyArgs
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.category.deleteMany(args);
  }
}
