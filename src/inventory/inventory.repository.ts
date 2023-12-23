import { EntityManager, Transaction, getRepository } from "typeorm";
import { ProductInventory } from "../models";
import { OrderStatus } from "../helper/constant";
import { productService } from "../product/product.service";
import { elasticSearchClient } from "../helper/elasticsearch";

const indexName = "products";
class ProductInventoryRepository {
  async editInventory(
    productId: number,
    quantity: number,
    transactionalEntityManager: EntityManager
  ): Promise<ProductInventory | null> {
    const productInventoryRepository =
      transactionalEntityManager.getRepository(ProductInventory);

    try {
      const productItem = await productService.findProductById(productId);
      //   const inventoryId = productItem.id
      const productInventory = productItem?.inventory;
      console.log(productInventory);
      if (!productInventory) {
        throw new Error(
          `ProductInventory not found for Product with id ${productId}`
        );
      }
      if (!productInventory.quantity) {
        throw new Error(`ProductInventory found error ${productId}`);
      }
      productInventory.quantity -= quantity;

      const searchResponse = await elasticSearchClient.search({
        index: indexName,
        body: {
          query: {
            term: { id: productId },
          },
        },
      });
      if (searchResponse) {
        const hits = searchResponse.hits.hits as Array<{
          _id: string;
          _index: string;
          _score: number;
          _source: Record<string, unknown>;
        }>;

        await elasticSearchClient.update({
          index: indexName,
          id: hits[0]._id,
          body: {
            doc: {
              inventory: productInventory,
            },
          },
        });
      } else {
        return null;
      }
      console.log(productInventory);

      await productInventoryRepository.save(productInventory);

      return productInventory;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }
}

const productInventoryRepository = new ProductInventoryRepository();
export { productInventoryRepository };
