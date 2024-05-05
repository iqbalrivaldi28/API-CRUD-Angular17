import { Component } from '@angular/core';
import { ModalsComponent } from './modals/modals.component';
import { IEmployes } from './interface/IEmployes';
import { EmployeeService } from './services/employee.service';
import { ModalsTambahComponent } from './modals-tambah/modals-tambah.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ModalsComponent, ModalsTambahComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-car';

  employes!: IEmployes[];
  error!: string;
  complated: boolean = false;
  editedEmployee!: IEmployes;
  itemEdit!: IEmployes;

  constructor(private emploessService: EmployeeService) {
    this.getEmploye();
  }

  getEmploye() {
    this.emploessService.getEmployes().subscribe({
      next: (data) => (this.employes = data),
      error: (err) => (this.error = err),
      complete: () => (this.complated = true),
    });
  }

  addDataForm = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
  });

  addData() {
    if (!this.addDataForm.valid) {
      alert('Data ngak valid');
      return;
    } else {
      console.log(this.addDataForm.value);
      this.emploessService.addEmploye(this.addDataForm.value).subscribe();
      this.getEmploye();
      this.addDataForm.reset();
    }
  }

  editEmployee(employee: IEmployes) {
    this.itemEdit = employee;
    // console.log(employee);
    console.log(this.itemEdit);
  }

  saveEditedEmployee() {
    if (this.editedEmployee) {
      const { name } = this.editedEmployee;
      this.emploessService
        .updateEmployee(name, this.editedEmployee)
        .subscribe(() => {
          this.getEmploye();
          // this.editedEmployee = null;
        });
    }
  }

  closeModal() {
    // this.editedEmployee = null;
  }

  deleteEmployee(name: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.emploessService.deleteEmploye(name).subscribe(() => {
        this.getEmploye();
      });
    }
  }
}
