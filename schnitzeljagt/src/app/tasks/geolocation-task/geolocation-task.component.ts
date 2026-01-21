import { Component, OnInit } from '@angular/core';
import { BaseTask } from '../base-task/base-task';
import { DecimalPipe } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

interface GeoPosition {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-geolocation-task',
  templateUrl: './geolocation-task.component.html',
  styleUrls: ['./geolocation-task.component.scss'],
  imports: [DecimalPipe, IonIcon],
})
export class GeolocationTaskComponent extends BaseTask implements OnInit {


  readonly TARGET_LATITUDE = 47.0502;
  readonly TARGET_LONGITUDE = 8.3093;
  readonly TARGET_RADIUS_METERS: number = 20;
  readonly TARGET_NAME = "Mattenhof 8 Migros";

  currentPosition: GeoPosition | null = null;
  distanceToTargetMeters: number | null = null;
  bearingToTargetDegrees: number = 0;

  isCheckingLocation = false;



  ngOnInit() {
    const sumulatedLatitude =
      this.TARGET_LATITUDE + (Math.random() - 0.5) * 0.001; // +/- ~55m
    const sumulatedLongitude =
      this.TARGET_LONGITUDE + (Math.random() - 0.5) * 0.001; // +/- ~55m

    this.currentPosition = {
      latitude: sumulatedLatitude,
      longitude: sumulatedLongitude
    };

    this.distanceToTargetMeters = this.calculateDistanceMeters(
      this.currentPosition.latitude,
      this.currentPosition.longitude,
      this.TARGET_LATITUDE,
      this.TARGET_LONGITUDE
    );

    this.bearingToTargetDegrees = this.calculateBearingDegrees(
      this.currentPosition.latitude,
      this.currentPosition.longitude,
      this.TARGET_LATITUDE,
      this.TARGET_LONGITUDE
    );
  }
  get targetIndicatorOffset() {
    if (this.distanceToTargetMeters == null) {
      return { x: 0, y: 0 };
    }

    const MAX_VISIBLE_RANGE_METERS = 120;
    const clambedDistance = Math.min(
      this.distanceToTargetMeters,
      MAX_VISIBLE_RANGE_METERS
    );

    const distanceRatio = clambedDistance / MAX_VISIBLE_RANGE_METERS;
    const radians = (this.bearingToTargetDegrees * Math.PI) / 180;

    return {
      x: Math.sin(radians) * distanceRatio * 50,
      y: -Math.cos(radians) * distanceRatio * 50
    };
  }

  checkLocation() {
    if (this.isCheckingLocation) return;

    this.isCheckingLocation = true;

    setTimeout(() => {
      this.isCheckingLocation = false;

      if (
        this.distanceToTargetMeters != null &&
        this.distanceToTargetMeters <= this.TARGET_RADIUS_METERS
      ) {
        setTimeout(() => this.finish(), 1000);
      }
    }, 1000);
  }

  private calculateDistanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const EARTH_RADIUS = 6371e3;

    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS * c;
  }
  private calculateBearingDegrees(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);
    return ((θ * 180) / Math.PI + 360) % 360;
  }
}
