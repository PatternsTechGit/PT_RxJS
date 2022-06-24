import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Blog } from '../app/models/posts';
import { BlogService } from './services/blog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BBBankUI';

  // declare and initialize an empty type safe array
  blogs: Blog[] = [];

  // dependency injecting the Blog Service
  constructor(private blogService: BlogService) {
  }

  ngOnInit(): void {

    // calling the service
    this.blogService.getBlogPosts()
      // filtering the top 10 posts based on criteria using lambda expression
      .pipe(map(p => p.filter(x => x.id < 10)))
      .subscribe(response => {
        this.blogs = response;
        console.log(this.blogs); 
      });
  }
}
