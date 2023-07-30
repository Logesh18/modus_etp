import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpserviceService {

  constructor(private http: HttpClient) { }

  fetchAllUsers() {
    return this.http.get(`${environment.HOST_LINKS.backend}/getAllUsers`);
  }

  createUser(data: any) {
      return this.http.post(`${environment.HOST_LINKS.backend}/createNewUser`, data);
  }

  updateUser(id: number, data: any) {
      return this.http.put(`${environment.HOST_LINKS.backend}/updateExistingUserDetail/${id + 1}`, data);
  }

  deleteUser(id: number, data: any) {
      return this.http.delete(`${environment.HOST_LINKS.backend}/deleteExistingUserDetail/${id + 1}`);
  }

  deleteAllUsers() {
      return this.http.delete(`${environment.HOST_LINKS.backend}/deleteAllUsers`);
  }

  filterUsers(key: string, searchValue: string) {
      return this.http.get(`${environment.HOST_LINKS.backend}/searchUserDetail?header=${key}&value=${searchValue}`);
  }
}
