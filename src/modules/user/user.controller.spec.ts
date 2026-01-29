import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get(UserController);
    userService = module.get(UserService);
  });

  describe('listUsers', () => {
    it('should return an array of users', async () => {
      const result = [new User()];

      userService.find.mockResolvedValue(result);

      const users = await userController.listUsers();

      expect(users).toEqual(result);
      expect(userService.find).toHaveBeenCalled();
    });
  });
});
