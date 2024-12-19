import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmployeeImportService } from './employee-import.service';

@Controller('employees')
export class EmployeeImportController {
  constructor(private readonly employeeImportService: EmployeeImportService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importEmployees(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(csv)' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const csvContent = file.buffer.toString('utf-8');

      const importedEmployees =
        await this.employeeImportService.importEmployeesFromCsv(csvContent);

      return {
        message: 'Employees imported successfully',
        count: importedEmployees.length,
        employees: importedEmployees,
      };
    } catch (error) {
      console.error('Import failed:', error);
      throw new Error('Failed to import employees');
    }
  }
}
