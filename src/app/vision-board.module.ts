import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisionBoardComponent } from './vision-board/vision-board.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: VisionBoardComponent }];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    VisionBoardComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class VisionBoardModule {}
