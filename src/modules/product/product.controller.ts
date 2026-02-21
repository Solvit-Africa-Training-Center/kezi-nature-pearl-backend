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
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { FileUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ProductResponseDto } from './dto/response/product-response.dto';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('product')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(UserRole.ADMIN)
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
  @Public()
  @ApiOperation({ summary: 'List of products' })
  async findAll() {
    return (
      await this.productService.findAll({
        relations: { images: { file: true }, category: { image: true } },
        order: { createdAt: 'DESC' },
      })
    ).map((product) => {
      return new ProductResponseDto(product);
    });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a product' })
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne({
      where: { id },
      relations: { images: { file: true }, category: { image: true } },
    });
    if (!product) throw new NotFoundException('Product not found');

    return new ProductResponseDto(product);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update Product' })
  @UseInterceptors(new FileUploadInterceptor('pictures', 5, false))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() pictures: Express.Multer.File[],
  ) {
    return await this.productService.update(id, dto, pictures);
  }

  @Delete()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete Product' })
  async remove(@Body() productIds: string[]) {
    return this.productService.remove(productIds);
  }
}
