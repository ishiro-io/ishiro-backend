import { Inject, forwardRef } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
  CategoryWhereUniqueInput,
} from "database/prisma";
import { CategoryService } from "services/category.service";

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

  @Query(() => Category)
  async category(@Args("id", { nullable: false }) id: number) {
    return this.categoryService.category({ id });
  }

  @Mutation(() => Category)
  async createCategory(@Args("data") data: CategoryCreateInput) {
    return this.categoryService.createCategory(data);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args("where", { nullable: false }) where: CategoryWhereUniqueInput,
    @Args("data") data: CategoryUpdateInput
  ) {
    return this.categoryService.updateCategory({ where, data });
  }

  @Mutation(() => Category)
  async deleteCategory(@Args("where") where: CategoryWhereUniqueInput) {
    return this.categoryService.deleteCategory(where);
  }
}
