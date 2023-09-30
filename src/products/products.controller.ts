import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Permissions } from 'src/decorators/permission.decorator';
import { PermissionType } from 'src/role/enum/permissions.enum';
import { PermissionGuard } from 'src/guards/permission.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.CREATE_PRODUCT)
  create() {
    return this.productsService.create();
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.GET_ALL_PRODUCT)
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.GET_ALL_PRODUCT)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.UPDATE_PRODUCT)
  update(@Param('id') id: string) {
    return this.productsService.update(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionType.DELETE_PRODUCT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
