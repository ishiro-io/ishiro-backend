import { Inject, forwardRef } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { Category } from "database/prisma";
import { CategoryService } from "services";

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService
  ) {}

  @Query(() => [Category])
  async categorys() {
    return this.categoryService.categorys({});
  }
}
