import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FatherComponent } from './father/father.component';

const components = [
    FatherComponent
];
@NgModule({
    imports: [
        CommonModule,
        IonicModule.forRoot(),
        FormsModule
    ],
    declarations: [components],
    exports: [components]
})


export class ComponentsModule { }
