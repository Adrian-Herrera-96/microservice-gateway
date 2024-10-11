import { BadRequestException, Controller, Get, Inject, Param, Post, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NATS_SERVICE } from 'src/config';
import { FileRequiredPipe } from './pipes/file-required.pipe';
@ApiTags('affiliates')
@Controller('affiliates')
export class AffiliatesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
  
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Mostrar un afiliado' })
  async findOneAffiliates(@Param('id') id: string) {
    return this.client.send('affiliate.findOne', { id });
  }
  
  @Post(':affiliate_id/:procedure_document_id/create-document')
  @ApiOperation({ summary: 'Enlazar y Subir Documento del Afiliado' })
  @ApiResponse({ status: 200, description: 'El documento fue subido exitosamente.' })
  @ApiResponse({ status: 400, description: 'El archivo PDF es obligatorio o el archivo no es válido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiParam({ name: 'affiliate_id', description: 'ID del afiliado', type: String, example: '123' })
  @ApiParam({ name: 'procedure_document_id', description: 'ID del del documento', type: String, example: '456' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo PDF del documento del afiliado',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        document_pdf: {
          type: 'string',
          format: 'binary',
          description: 'Archivo PDF a subir',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('document_pdf'))
  @UsePipes(new FileRequiredPipe())
  async createDocuments(
    @Param('affiliate_id') affiliateId: string,
    @Param('procedure_document_id') procedureDocumentId: string,
    @UploadedFile() document_pdf: Express.Multer.File
  ) {
    return this.client.send('affiliate.createDocuments', {
      affiliateId,
      procedureDocumentId,
      buffer: document_pdf.buffer,
    });
  }

  @Get(':id/documents')
  @ApiResponse({ status: 200, description: 'Mostrar Documentos del Afiliado' })
  async showDocuments(@Param('id') id: string) {
    return this.client.send('affiliate.showDocuments', { id });
  }
}
