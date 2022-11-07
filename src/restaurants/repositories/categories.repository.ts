import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

export class CategoryRepository extends Repository<Category> {
  async getOrCreateCategory(name: string = '', uri: string = '') {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/ /g, ' ');
    let category: Category = await this.findOne({
      where: {
        slug: categorySlug,
      },
    });

    if (!category) {
      category = await this.save(
        this.create({ slug: categorySlug, name: categoryName, coverImg: uri }),
      );
    }

    let categoryImage: Category = await this.findOne({
      where: {
        slug: categorySlug,
        coverImg: uri,
      },
    });

    if (!categoryImage) {
      if (category) {
        category.coverImg = uri;
        await this.save(category);
      }
    }

    return category;
  }
}
