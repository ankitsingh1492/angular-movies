import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-search-icon',
  templateUrl: './search-icon.component.svg',
  styles: [
    `
      svg {
        fill: currentColor;
        width: 1.125em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SearchIconComponent {}

@NgModule({
  declarations: [SearchIconComponent],
  exports: [SearchIconComponent],
})
export class SearchIconComponentModule {}
