import {customElement, bindable} from 'aurelia-framework';

@customElement('customer-panel')
export class CustomerPanel {
  
  customerWidgets = [
    {viewModel: 'hud/_widgets/customerstats/customer.stats'},
    {viewModel: 'hud/_widgets/customerhistory/customer.history'}
  ];
}