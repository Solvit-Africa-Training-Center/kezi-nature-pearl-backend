import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/request';
import { CategoryResponse } from './dto/response';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('category')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(new FileUploadInterceptor('picture', 1))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return await this.categoryService.create(dto, picture);
  }

  @Get()
  @Public()
  async findAll() {
    return (await this.categoryService.findAll({ relations: ['image'] })).map(
      (category) => {
        return new CategoryResponse(category);
      },
    );
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne({
      where: { id },
      relations: ['image'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return new CategoryResponse(category);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(new FileUploadInterceptor('picture', 1))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return await this.categoryService.update(id, dto, picture);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
