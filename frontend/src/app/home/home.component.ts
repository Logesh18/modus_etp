import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  public form: any;
  public userDetails: any[] = [];
  public searchData: string = '';
  public selectedFilter: string | null = null;
  public isUpdate: boolean = false;
  public updateIndex: number = -1;
  public searchFilters: any[] = [
      {label: 'Select Filter', value: ''},
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Age', value: 'age' },
      { label: 'Mobile No', value: 'mobile_no' },
      { label: 'City', value: 'city' },
      { label: 'Pincode', value: 'pincode'}
  ]
  
  constructor(private httpService: HttpserviceService) {
      
    this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(60)]),
        mobile_no: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
        city: new FormControl('', Validators.required),
        pincode: new FormControl('', Validators.required)
      });
      this.fetchAllUsers();
      
  }

  ngOnInit(): void {
    
  }

  selectFilter(event: Event) {
    this.selectedFilter = (event.target as HTMLSelectElement).value;
  }

  fetchAllUsers() {
    this.httpService.fetchAllUsers().subscribe((res: any) => {
        this.userDetails = res.results;
    });  
  }

  onCreate() {
    if (!this.isUpdate) {
      let newUser: any = this.form.value;
      let payloadData: any = {
        newUser : Object.values(newUser)
      }
      this.httpService.createUser(payloadData).subscribe((res: any) => {
          this.userDetails = res.results;
          this.form.reset();
      }); 
    } else {
      let updatedUserDetail: any = this.form.value;
      updatedUserDetail = Object.values(updatedUserDetail);
      this.httpService.updateUser(this.updateIndex, { "updateData": updatedUserDetail })
      .subscribe((res: any) => {
          this.userDetails = res.results;
          this.form.reset();
          this.isUpdate = false;
          this.updateIndex = -1;
      });
    }
  }

  onUpdate(index: number, data: any) {
    this.isUpdate = true;
    this.updateIndex = index;
    this.form.setValue(data);
  }

  onDelete(index: number) {
      this.httpService.deleteUser(index, { "operation": "delete" }).subscribe((res: any) => {
          this.userDetails = res.results;
      });
  }

  onDeleteAll() {
      this.httpService.deleteAllUsers().subscribe((res: any) => {
          this.userDetails = res.results;
      });
  }

  onSearch(event: HTMLInputElement) {
      if(event.value && this.selectedFilter) {
        this.httpService.filterUsers(this.selectedFilter, event.value).subscribe((res: any) => {
            this.userDetails = res.results;
        });  
      } else {
          this.fetchAllUsers();
      }
  }

}
