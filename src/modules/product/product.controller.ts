import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { FileUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { ApiConsumes, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './dto/response/product-response.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Add Product' })
  @UseInterceptors(new FileUploadInterceptor('pictures', 5))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() pictures: Express.Multer.File[],
  ) {
    return await this.productService.create(dto, pictures);
  }

  @Get()
  @ApiOperation({ summary: 'List of products' })
  async findAll() {
    return (
      await this.productService.findAll({
        relations: { images: { file: true } },
      })
    ).map((product) => {
      return new ProductResponseDto(product);
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product' })
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne({
      where: { id },
      relations: { images: { file: true } },
    });
    if (!product) throw new NotFoundException('Product not found');

    return new ProductResponseDto(product);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
