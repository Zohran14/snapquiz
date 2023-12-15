import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { Limit } from './guards/limit.guard';
import { Quiz } from '@snapquiz/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('v1/hello')
  hello(): string {
    return 'Hello';
  }
  @Limit(1024 * 1024)
  @Post('v1/create-quiz')
  classifyText(@Body() request: { data: string }): Promise<Quiz[]> {
    return this.appService.createQuiz(request.data);
  }

  @Post('v1/ocr-base64')
  async classifyImageb64(@Body() req: { data: string }) {
    const b64 = req.data;
    const buffer = Buffer.from(b64, 'base64');
    return await this.appService.ocr(buffer);
  }
  @Post('v1/ocr')
  @UseInterceptors(FileInterceptor('file'))
  async classifyImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    return await this.appService.ocr(file.buffer);
  }
}
