import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/orderitem.entity';
import { Product } from '../product/product.entity';
import { CreateOrderItemDto } from './dto/create-orderitem.dto';
import { UpdateOrderitemDto } from './dto/update-orderitem.dto';



@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  
  async create(dto: CreateOrderItemDto) {
    
    const product = await this.productRepo.findOne({
      where: { productId: dto.product_id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    
    const orderItem = this.orderItemRepo.create({
      product,
      quantity: dto.quantity,
    });

  
    const saved = await this.orderItemRepo.save(orderItem);

    
    return {
      id: saved.id,
      productId: saved.product.productId,
      productName: saved.product.name,
      quantity: saved.quantity,
    };
  }

 
  async findAll() {
    const items = await this.orderItemRepo.find({
      relations: ['product'], 
    });

   
    return items.map((item) => ({
      id: item.id,
      productId: item.product.productId,
      productName: item.product.name,
      quantity: item.quantity,
    }));
  }

  
  async findOne(id: string) {
    const item = await this.orderItemRepo.findOne({
      where: { id },
      relations: ['product'], 
    });

    if (!item) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    return {
      id: item.id,
      productId: item.product.productId,
      productName: item.product.name,
      quantity: item.quantity,
    };
  }

  
  async update(id: string, dto: UpdateOrderitemDto) {
    const item = await this.orderItemRepo.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!item) {
      throw new NotFoundException('OrderItem not found');
    }

    
    if (dto.product_id) {
      const product = await this.productRepo.findOne({
        where: { productId: dto.product_id },
      });
      if (!product) throw new NotFoundException('Product not found');
      item.product = product;
    }

    
    if (dto.quantity !== undefined) {
      item.quantity = dto.quantity;
    }

    const updated = await this.orderItemRepo.save(item);

    return {
      id: updated.id,
      productId: updated.product.productId,
      productName: updated.product.name,
      quantity: updated.quantity,
    };
  }

  async remove(id: string) {
    const result = await this.orderItemRepo.softDelete(id);

    if (result.affected === 0) {
      return { message: 'OrderItem not found or already deleted' };
    }

    return { message: 'OrderItem deleted successfully', id };
  }
}
