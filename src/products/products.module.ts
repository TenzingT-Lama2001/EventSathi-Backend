import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [RoleModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductsModule {}
