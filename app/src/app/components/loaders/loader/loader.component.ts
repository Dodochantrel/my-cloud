import { Component, input } from '@angular/core';
import { DarkVadorLoaderComponent } from '../dark-vador-loader/dark-vador-loader.component';
import { DeliveryCarLoaderComponent } from '../delivery-car-loader/delivery-car-loader.component';

@Component({
  selector: 'app-loader',
  imports: [DarkVadorLoaderComponent, DeliveryCarLoaderComponent],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  public loaderStyle = input<LoaderStyle>('delivery-car');
}

export type LoaderStyle = 'dark-vador' | 'delivery-car';