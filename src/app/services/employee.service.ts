import { Injectable } from '@angular/core';
import { IEmployes } from '../interface/IEmployes';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  url = 'http://localhost:4200/api/pegawai';

  employes: IEmployes[] = [];

  constructor(private http: HttpClient) {}

  getEmployes(): Observable<IEmployes[]> {
    return this.http.get<IEmployes[]>(this.url);
  }

  addEmploye(body: any) {
    return this.http.post(this.url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });
  }

  updateEmployee(name: string, body: any): Observable<any> {
    const url = `${this.url}/${name}`;
    return this.http.put(url, body);
  }

  deleteEmploye(name: string): Observable<any> {
    const url = `${this.url}/${name}`;
    return this.http.delete(url);
  }
}
