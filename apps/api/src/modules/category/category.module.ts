import { Module } from "@nestjs/common";

import { CategoryService } from "services/category.service";
import { PrismaService } from "services/prisma.service";

import { CategoryResolver } from "./category.resolver";

@Module({
  providers: [CategoryService, CategoryResolver, PrismaService],
  exports: [CategoryService],
})
export class CategoryModule {}
