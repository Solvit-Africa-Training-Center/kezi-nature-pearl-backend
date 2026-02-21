import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartStatus } from 'src/common/enums/product.enum';
import { OrderService } from '../order/order.service';
import { CartCheckoutDto } from './dto/request';
import { PaymentService } from '../payment/payment.service';
import { AddressService } from '../address/address.service';
import { OrderInvoiceDto } from '../order/dto/response/order-invoice.dto copy';
import { AddItemTocartDto } from '../item/dto/request';
import { ItemService } from '../item/item.service';
import { setUserGuestId } from 'src/util';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    private readonly dataSource: DataSource,
    private readonly orderService: OrderService,
    private readonly addressService: AddressService,
    private readonly paymentService: PaymentService,
    private readonly itemService: ItemService,
  ) {}

  async checkCart(owner: { userId?: any; guestId?: any }) {
    let { userId, guestId } = setUserGuestId(owner);

    let cart = await this.cartRepo.findOne({
      where: { userId, guestId },
      relations: { items: { product: { images: { file: true } } } },
    });

    if (!cart) {
      const cartData = {
        userId: userId || null,
        guestId: userId ? null : (guestId ?? null),
        status: CartStatus.ACTIVE,
      };
      cart = this.cartRepo.create(cartData as Cart);
      await this.cartRepo.save(cart);
    }

    cart = await this.cartRepo.findOne({
      where: { userId, guestId, status: CartStatus.ACTIVE },
      relations: { items: { product: { images: { file: true } } } },
      order: {
        items: {
          createdAt: 'DESC',
        },
      },
    });

    return cart;
  }

  async addCartItem(
    dto: AddItemTocartDto,
    owner: { userId?: any; guestId?: any },
  ) {
    const cart = await this.checkCart(owner);

    if (!cart) throw new NotFoundException('Cart not found');

    return await this.itemService.createItem(dto, cart);
  }

  async updateCartItem(
    id: string,
    quantity: number,
    owner: { userId?: any; guestId?: any },
  ) {
    const cart = await this.checkCart(owner);

    if (!cart) throw new NotFoundException('Cart not found');

    return await this.itemService.updateItem(id, quantity, cart.id);
  }

  async deleteItemFromCart(
    id: string,
    owner: { userId?: string | null; guestId: string | null },
  ) {
    const cart = await this.checkCart(owner);

    if (!cart) throw new NotFoundException('Cart not found');

    return await this.itemService.deleteItem(id, cart.id);
  }

  async clearCart(owner: { userId?: string | null; guestId: string | null }) {
    const cart = await this.checkCart(owner);

    if (!cart) throw new NotFoundException('Cart not found');

    await this.cartRepo.delete(cart.id);
    return { message: 'Cart cleared' };
  }

  async checkout(owner: { userId?: any; guestId: any }, dto: CartCheckoutDto) {
    return await this.dataSource.transaction(async (manager) => {
      let { userId, guestId } = setUserGuestId(owner);

      const cart = await this.checkCart(owner);

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

      await this.itemService.updateOrderItem(cart.items, order.id);

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
}
