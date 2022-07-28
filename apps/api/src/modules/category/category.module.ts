import { Module } from "@nestjs/common";

import { CategoryService, PrismaService } from "services";

import { CategoryResolver } from "./category.resolver";

@Module({
  providers: [CategoryService, CategoryResolver, PrismaService],
  exports: [CategoryService],
})
export class CategoryModule {}
