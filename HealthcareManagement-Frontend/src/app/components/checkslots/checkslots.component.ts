import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Slots } from 'src/app/models/slots';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-checkslots',
  templateUrl: './checkslots.component.html',
  styleUrls: ['./checkslots.component.css']
})
export class CheckslotsComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  slots : Observable<Slots[]> | undefined;
  
  constructor(private _service : DoctorService) { }

  ngOnInit(): void
  {
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');

    this.currRole = (sessionStorage.getItem('ROLE') || '').replace(/"/g, '');

    this.slots = this._service.getSlotList();

  }

}
