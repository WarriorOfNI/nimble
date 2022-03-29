import { Component } from '@angular/core';
import { Theme, ThemeProviderTheme } from '@ni/nimble-angular';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public theme: ThemeProviderTheme = Theme.Light;
}
