import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ManagerModule } from './manager/manager.module';
import { EmployeeModule } from './employee/employee.module';
import { TaskEmployeePerspectiveModule } from './taskEmployeePerspective/task.employee.perspective.module';
import { TaskManagerPerspectiveModule } from './taskManagerPerspective/task.manager.perspective.module';
import { TaskModule } from './task/task.module';
import { CoinsModule } from './coins/coins.module';


@Module({
  imports: [UserModule, ManagerModule, EmployeeModule, TaskEmployeePerspectiveModule, TaskManagerPerspectiveModule, TaskModule, ManagerModule, EmployeeModule, CoinsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
