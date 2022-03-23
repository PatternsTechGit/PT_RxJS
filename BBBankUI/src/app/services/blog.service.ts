import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Blog } from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  // depdendency injecting HttpClient
  constructor(private httpClient: HttpClient) { }

  // returning type safe Blog array
  getBlogPosts(): Observable<Blog[]> {
    // calling HttpClient get method to call the API
    // contructing the URL using the environment variable and path to the function (i.e., posts)
    return this.httpClient.get<Blog[]>(environment.baseUrl + 'posts');
  }
}
