import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PortService } from './port.service';
import { ResultType } from './result_type';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private port: PortService, private http: HttpClient) { }
  public async getBooks(): Promise<BookRes[]> {
    let headers = this.port.getJwtBearer();
    headers["ContentType"] = "application/json";
    let output = await ResultType.invokeThrow<BookRes[], Error>(
      (onResponse) => {
        this.http.get<BookRes[]>(
          this.port.port + `book-authors/GetBooksAuthors`,
          {
            headers
          }
        ).subscribe({
          next(data) {
            onResponse(null, data);
          },
          error(msg) {
            onResponse(msg, null);
          }
        })
      }
    );
    return output;
  }

}
export class ObjectCopier<T> {
  public copyWith(modifyObject: Partial<T>): T {
    return Object.assign(Object.create(this.constructor.prototype), this, modifyObject);
  }
}

export class Author extends ObjectCopier<Author> {
  constructor(
    public readonly id: number,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly pen_name: string
  ) {
    super();
  }
}

export class AuthorBook extends ObjectCopier<AuthorBook> {
  constructor(
    public readonly id: number,
    public readonly book_id: string,
    public readonly author_id: string
  ) {
    super();
  }
}

export class Book extends ObjectCopier<Book> {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly publisher: string,
    public readonly price: string,
    public readonly publication_year: string
  ) {
    super();
  }
}

export class BookRes extends ObjectCopier<BookRes> {
  constructor(
    public readonly book: Book,
    public readonly authors: Author[]
  ) {
    super();
  }
}
