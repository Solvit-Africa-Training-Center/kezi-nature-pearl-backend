import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ProductService } from './product.service';
import {
  CreateProductDTO,
  IdProductDTO,
  ProductDTO,
  UpdateProductDTO,
} from './product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'List Products' })
  @Get()
  async listProduct(@Query() dto: ProductDTO) {
    return await this.productService.find(dto);
  }

  @ApiOperation({ summary: 'Add new Product' })
  @Post()
  async addProduct(@Body() dto: CreateProductDTO) {
    await this.productService.create(dto);
    return 'Product added';
  }

  @ApiOperation({ summary: 'Update Product' })
  @Patch(':productId')
  async updateProduct(
    @Param() params: IdProductDTO,
    @Body() dto: UpdateProductDTO,
  ) {
    await this.productService.update(params, dto);
    return 'Product Updated ';
  }

  @ApiOperation({ summary: 'Delete Product' })
  @Delete(':productId')
  async deleteProduct(@Param() id: IdProductDTO) {
    await this.productService.hardDelete(id.productId);
    return 'Product Deleted';
  }
}
