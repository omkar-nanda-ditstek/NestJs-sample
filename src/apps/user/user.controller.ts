import { Controller, UseGuards, SetMetadata, Post, Body } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/role-guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Roles from '../../common/enums/Roles';
import Permissions from '../../common/enums/Permissions';
import Modules from '../../common/enums/Modules';
@ApiTags('profile')
@ApiBearerAuth() 
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  
  @Post('add-product')
  @SetMetadata('roles', [Roles.ADMIN, Roles.USER])
  @SetMetadata('permissions', [Permissions.CREATE])
  @SetMetadata('module', Modules.PRODUCT)
  addProduct(@Body() body: { productName: string }) {
    
    return { message: `Product ${body.productName} added successfully` };
  }
}
