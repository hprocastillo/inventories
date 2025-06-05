import { Component } from '@angular/core';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-products-list',
  imports: [
    NgbPagination,
    NgForOf
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {

}
