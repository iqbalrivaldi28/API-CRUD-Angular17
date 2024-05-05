import { Component, Input, input } from '@angular/core';
import { IEmployes } from '../interface/IEmployes';
import { AppComponent } from '../app.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-modals',
  standalone: true,
  imports: [AppComponent, ReactiveFormsModule],
  templateUrl: './modals.component.html',
  styleUrl: './modals.component.scss',
})
export class ModalsComponent {
  @Input() itemEdit!: IEmployes;
  @Input() callback!: any;
  editDataForm!: FormGroup;

  constructor(private employeService: EmployeeService) {
    this.editDataForm = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
    });
  }

  ngOnChanges(): void {
    console.log(this.itemEdit);
    if (this.itemEdit) {
      this.editDataForm.patchValue({
        name: this.itemEdit.name,
        address: this.itemEdit.address,
        position: this.itemEdit.position,
      });
    }
  }

  editData() {
    console.log(this.editDataForm.value);
    const name = this.editDataForm.value.name;
    this.employeService
      .updateEmployee(name, this.editDataForm.value)
      .subscribe({
        next: (data) => console.log(data),
        error: (err) => console.log(err),
      });
  }
}
