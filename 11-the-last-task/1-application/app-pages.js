import { DashboardPage } from "./pages/dashboard-page.js";
import { ProductsListPage } from "./pages/products-list-page.js";
import { AddProductPage } from "./pages/add-product-page.js";
import {SalesPage} from "./pages/sales-page.js";
import {EditProductPage} from "./pages/edit-product-page.js";
import {CategoriesPage} from "./pages/categories-page.js";

export const rules = [
  {
    pathname: '/',
    page: new DashboardPage()
  },
  {
    pathname: '/products',
    page: new ProductsListPage()
  },
  {
    pathname: '/products/add',
    page: new AddProductPage()
  },
  {
    pathname: /^\/products\/([^\/]+)$/,
    page: new EditProductPage()
  },
  {
    pathname: '/categories',
    page: new CategoriesPage()
  },
  {
    pathname: '/sales',
    page: new SalesPage()
  }
];
