import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorator';
import { UserRole } from 'src/common/enums/user.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TransactionSearchDto } from './dto/request/search-query.dto';

@Controller('transactions')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @Get()
  // getTransaction(@Query() query: TransactionSearchDto) {
  //   return this.transactionService.getTransaction({ where: { ...query } });
  // }
}
