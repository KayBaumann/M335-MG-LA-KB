import { Component, OnInit } from '@angular/core';
import { BaseTask } from '../base-task/base-task';

@Component({
  selector: 'app-geolocation-task',
  templateUrl: './geolocation-task.component.html',
  styleUrls: ['./geolocation-task.component.scss'],
})
export class GeolocationTaskComponent  extends BaseTask implements OnInit {

  async checkLocation(){
    const success = true;

    if(success){
      this.finish();
    }
  }

  ngOnInit() {}

}
