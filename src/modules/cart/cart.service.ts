import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemService } from '../cart-item/cart-item.service';
import { ProductService } from '../product/product.service';
import { CartStatus } from 'src/common/enums/product.enum';
import { OrderService } from '../order/order.service';
import { CartCheckoutDto } from './dto/request';
import { PaymentService } from '../payment/payment.service';
import { AddressService } from '../address/address.service';
import { OrderInvoiceDto } from '../order/dto/response/order-invoice.dto copy';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    private readonly dataSource: DataSource,
    private readonly orderService: OrderService,
    private readonly addressService: AddressService,
    private readonly paymentService: PaymentService,
  ) {}

  async getUserCart(owner: {
    userId?: string | null;
    guestId?: string | null;
  }) {
    const { userId, guestId } = owner;

    let cart: Cart | null = null;
    if (userId) {
      cart = await this.cartRepo.findOne({
        where: {
          userId,
          status: CartStatus.ACTIVE,
        },
        relations: { items: true },
      });
    } else if (guestId) {
      cart = await this.cartRepo.findOne({
        where: {
          guestId,
          status: CartStatus.ACTIVE,
        },
        relations: { items: true },
      });
    }

    if (!cart) {
      const cartData = {
        userId: userId || null,
        guestId: userId ? null : (guestId ?? null),
        status: CartStatus.ACTIVE,
      };
      cart = this.cartRepo.create(cartData as Cart);
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  async checkout(userId: string, guestId: string, dto: CartCheckoutDto) {
    return await this.dataSource.transaction(async (manager) => {
      const cart = await this.findOne({
        where: { userId, guestId, status: CartStatus.ACTIVE },
        relations: { items: true },
        select: {
          id: true,
          userId: true,
          guestId: true,
          status: true,
          items: {
            productId: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
          },
        },
      });

      if (!cart || !cart.items) throw new NotFoundException('Cart not found');

      if (!dto.addressId && !dto.shippingAddressSnapshot)
        throw new BadRequestException('No shipping address provided');

      if (userId) {
        if (dto.addressId) {
          const address = await this.addressService.findOne({
            where: { id: dto.addressId, userId },
            relations: { user: true },
          });

          if (!address) throw new NotFoundException('Address not found');

          dto.shippingAddressSnapshot = {
            fullName: address.fullName,
            phoneNumber: address.phoneNumber,
            email: address.user.email,
            country: address.country,
            state: address.state ?? '',
            city: address.city ?? '',
            province: address.province ?? '',
            district: address.district ?? '',
            sector: address.sector ?? '',
            addressLine1: address.addressLine1 ?? '',
            postalCode: address.postalCode ?? '',
          };
        } else if (dto.saveAddress && dto.shippingAddressSnapshot) {
          const addresses = await this.addressService.findAll({
            where: { userId },
          });

          if (addresses.length >= 3)
            throw new BadRequestException('User can only save 3 addresses');

          await this.addressService.create(userId, {
            ...dto.shippingAddressSnapshot,
          });
        }
      }

      const order = await this.orderService.create({
        userId,
        guestId,
        items: cart.items,
        ...dto,
      });

      await this.paymentService.momoPaymentService({
        orderId: order.id,
        phoneNumber: dto.phoneNumber,
      });

      await this.cartRepo.update(
        { id: cart.id },
        { status: CartStatus.CONVERTED },
      );

      const invoice = await this.orderService.findOne({
        where: { id: order.id },
        relations: { items: { product: { images: { file: true } } } },
      });

      return invoice
        ? {
            message: 'Checkout succesful',
            data: new OrderInvoiceDto(invoice),
          }
        : {
            message: 'Checkout succesful. No invoice',
          };
    });
  }

  async clearCart(owner: { userId?: string | null; guestId: string | null }) {
    const { userId, guestId } = owner;
    let cart;
    if (userId) cart = await this.findOne({ where: { userId } });
    else if (guestId) cart = await this.findOne({ where: { guestId } });

    await this.cartRepo.delete(cart.id);
    return { message: 'Cart cleared' };
  }

  // Helper
  async findOne(options: FindOneOptions<Cart>) {
    return await this.cartRepo.findOne(options);
  }
}
