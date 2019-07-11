import { animation, trigger, transition, animate, style, state } from '@angular/animations';

export const popAnimation = animation([
  trigger('pop', [
    state('inactive', style({
      transform: 'scale(0.1)'
    })),
    state('active', style({
      transform: 'scale(1)'
    })),
    transition('inactive => active', animate('800ms ease-in')),
  ])
]);
