import { Component, OnInit } from '@angular/core';
import { ApiService, Author, BookRes } from './service/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private apiService: ApiService) { }
  book: BookRes[] = [];
  currentPage: number = 1;
  perPage: number = 5;
  select: string = 'all';
  async getBooks() {
    this.book = await this.apiService.getBooks();
    this.sortAuthors();
  }

  sortAuthors() {
    this.book.forEach(list => {
      list.authors.sort((a, b) => a.first_name.localeCompare(b.first_name));
    });
  }

  setName(authors: any[]) {
    return authors.map((author) => author.first_name).join(", ");
  }
  filteredCoinres() {
    if (this.select !== 'all') {
          return this.book.filter(item =>
        (item.authors.some(author => author.first_name.toLowerCase().includes(this.select.toLowerCase())))
      );}else{
        return this.book;
      }
  }
  get paginatedBooks() {
    const startIndex = (this.currentPage - 1) * this.perPage;
    return this.filteredCoinres().slice(startIndex, startIndex + this.perPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCoinres().length / this.perPage);
  }

  get pageNumbers(): number[] {
    return new Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }

  ngOnInit() {
    this.getBooks();
    console.log(this.book);

  }
}
