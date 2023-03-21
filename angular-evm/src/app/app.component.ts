import { Component } from '@angular/core'
import { init, openWallet, signIn, signOut, WALLET_TABS } from '@ramper/ethereum'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app'

  public ngOnInit() {
    window.RAMPER_ENV = 'local'

    init({
      appName: 'Polygon Test App',
      appId: 'suyklxmori',
      walletProviders: ['metamask'],
      walletTabs: [WALLET_TABS.NFT, WALLET_TABS.COIN],
      theme: 'dark',
      network: 'maticmum',
      authProviders: ['google', 'facebook', 'twitter', 'apple', 'email'],
      language: 'en',
    })
  }

  openWallet = openWallet
  signIn = signIn
  signOut = signOut
}
