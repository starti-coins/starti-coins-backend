import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ManagerModule } from './manager/manager.module';
import { EmployeeModule } from './employee/employee.module';
import { TaskEmployeePerspectiveModule } from './taskEmployeePerspective/task.employee.perspective.module';
import { TaskManagerPerspectiveModule } from './taskManagerPerspective/task.manager.perspective.module';
import { TaskModule } from './task/task.module';
import { CoinsModule } from './coins/coins.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UserModule, ManagerModule, EmployeeModule, TaskEmployeePerspectiveModule, TaskManagerPerspectiveModule, TaskModule, ManagerModule, EmployeeModule, CoinsModule, AppController, AppService, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
