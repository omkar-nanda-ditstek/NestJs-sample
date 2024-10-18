import {
  Controller,
  UseGuards,
  SetMetadata,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  UsePipes,
} from '@nestjs/common';
import { RolesGuard } from '../../common/guards/role-guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Roles from '../../common/enums/Roles';
import Permissions from '../../common/enums/Permissions';
import Modules from '../../common/enums/Modules';
import { EmailService } from '../../utils/email/email.service';
import { SmsService } from '../../utils/sms/sms.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../../utils/upload/upload.service';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { JoiValidationPipe } from '../../common/validations/joi-validation.pipe';
import { sendEmailSchema } from './validation/email.validation';
import { SendEmailDto } from './dto/send-email.dto';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('user')
@UseGuards(RolesGuard, ThrottlerGuard)
export class UserController {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly fileUploadService: UploadService,
  ) {}

  // ADD PRODUCT ROUTE
  @Post('add-product')
  @SetMetadata('roles', [Roles.ADMIN, Roles.USER])
  @SetMetadata('permissions', [Permissions.CREATE])
  @SetMetadata('module', Modules.PRODUCT)
  addProduct(@Body() body: { productName: string }) {
    return { message: `Product ${body.productName} added successfully` };
  }

  //SEND-EMAIL TEST ROUTE
  @Post('send-email')
  @SetMetadata('roles', [Roles.ADMIN, Roles.USER])
  @UsePipes(new JoiValidationPipe(sendEmailSchema))
  async sendEmail(
    @Body()
    body: SendEmailDto
  ) {
    return this.emailService.sendEmail(body.to, body.subject, body.text);
  }

  //SEND-MESSAGE TEST ROUTE
  @Post('send-msg')
  @SetMetadata('roles', [Roles.ADMIN, Roles.USER])
  async sendMessage(@Body() body: { to: string; message: string }) {
    console.log('body:', body);
    return this.smsService.sendSms(body.to, body.message);
  }

  //FILE UPLOAD TEST ROUTE
  @Post('upload')
  @SetMetadata('roles', [Roles.ADMIN, Roles.USER])
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.fileUploadService.uploadFile(file);
    return { url: fileUrl };
  }

  // CHECK RATE LIMITING
  @Get('limited')
  @SetMetadata('roles', [Roles.ADMIN, Roles.USER])
  getLimitedExample() {
    return 'This endpoint is rate limited to 5 requests per minute.';
  }
}
