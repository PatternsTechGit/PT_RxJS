# Calling an API and manipulating its data using RxJS operators

## What is RxJS
> [RxJS](https://rxjs.dev/guide/overview) is a javascript library that brings the concept of *reactive programming* to the web.

Reactive programming is just a different way of building software applications. Essentially your software is built to *react* to changes that happens (like click events, data being fetched, etc.)

## About this exercise

Previously we scaffolded a new angular application  

* Using **angular CLI**
* Got the understanding of the project structure (Module, Component, and bootstrapping the application) 

In this exercise we will

* Create a custom service 
* Consume an API [JSON placeholder](https://jsonplaceholder.typicode.com/) using `HttpClient`
* Return the **Observable** from the service
* Inject the service into our angular component
* Filter the response from the service using **RxJS operators** (pipe, map, and filter)

## Basic concepts of RxJS
> An [Observable](https://rxjs.dev/guide/observable) is basically a function that can return a *stream of data* to an observer over time.

> [Observer](https://rxjs.dev/guide/observer) is there to execute some code whenever it receives a new value from the observable. We connect observable to the observer through subscription using a method called **subscribe**.

> So observer can implement (in subscribe method) up to three methods **next**, **error**, and **complete**.

- `next()` will be called by the observable whenever it emits a new value.
- `error()` will be called whenever observable throws an error. 
- `complete()` is called whenever the observable is done.
![Observable](https://user-images.githubusercontent.com/100778209/157576466-819f0b12-8bac-401d-a0e1-c43485eb2f96.png)

```typescript

var observer = {
  next: function (value) {
    console.log(value);
  },
  error: function (error) {
    console.log(error);
  },
  complete: function () {
    console.log('Completed');
  }
};

var subscription = Rx.Observable.create(function (obs) {
  obs.next('A value');
  //obs.error('Error');
  obs.complete();
})
  .subscribe(observer);  
```
## Lets implement it in our Angular Project
we are going to call an existing api using [JSON placeholder](https://jsonplaceholder.typicode.com/) which will return data about `Blogs` as an *observable*. 

We will manipulate that data using RxJS operators and then we will show the final result using subscription.

## Step 1: Scaffolding a new angular application
To scaffold a new angular application. See [Angular CLI](https://github.com/PatternsTechGit/PT_AngularCLI) lab.

## Step 2: Incorporating HttpClient to communicate with API
To use `HttpClient` service in angular. See this angular guide: https://angular.io/guide/http#setup-for-server-communication

## Step 3: Setting up API's base URL
Setup base URL property `baseUrl` in development environment,for this we will simply put it in `environment.ts` file. 

```typescript

export const environment = {
  production: false,
  baseUrl: 'https://jsonplaceholder.typicode.com/'
};

```
To understand more about environment configuration. See [configuring application environment](https://angular.io/guide/build)

## Step 4: Creating a type safe model
API has a function `/posts` that returns an array of object that looks like.

![image](https://user-images.githubusercontent.com/100778209/157579376-36ad32e3-d21a-4b4e-85bb-d4b191cdefdd.png)

To capture this array in type safe manner we will introduce a TypeScript interface matching the same property names as of returned objects.

We will create a folder called **models** in **app** folder to contain all of our models. In it we will create a file called `posts.ts`

```typescript

export interface Blog {
  userId: number;
  id: number;
  title: string;
  body: string;
}

```

## Step 5: Creating a service to fetch data from API
To fetch data from api we will create an angular service `BlogService`. We will create a folder called **services** in **app** folder to contain all the services in the application. In this folder we will run the command.

```typescript
ng generate service blog
```

This will scaffold a new service in our application in the file `blog.service.ts` with following code:

```typescript

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor() { }
}


```

## Step 6: Using Http Client to call the API
We will *dependency inject* `HttpClient` in `BlogService` to call the api in a function called `getBlogPosts`. This function will use base url from the environment to construct function url and will use **Blog** *interface* to deserialize and return objects into type safe array.

```typescript

@Injectable({
  providedIn: 'root'
})

export class BlogService {

  // dependency injecting HttpClient
  constructor(private httpClient: HttpClient) { }

  // returning type safe Blog array
  getBlogPosts(): Observable<Blog[]> {
    // calling HttpClient get method to call the API
    // constructing the URL using the environment variable and path to the function (i.e., posts)
    return this.httpClient.get<Blog[]>(environment.baseUrl + 'posts');
  }
}


```

## Step 7: Using Blog Service in the component
We will dependency inject the `BlogService` in the **AppComponent** and call the `getBlogPosts` method in `OnInit` life cycle hook to get the observable.

```typescript
 this.blogService
      .getBlogPosts()
      .subscribe(response => { this.blogs = response; });
```
## Step 8: Using RxJS Operators to manipulate data
> An operator is a pure function which takes in observable as input and the output is also an observable.

#### Pipe
> It’s a standalone function and a method on the observable interface that can be used to combine multiple RxJS operators to compose asynchronous operations.

#### Map
> Applies a given function to each value emitted by the source Observable, and emits the resulting values as an Observable.

#### Filter
> Filter items emitted by the source Observable by only emitting those that satisfy a specified condition.

```typescript
  // declare and initialize an empty type safe array
  blogs: Blog[] = [];

  // dependency injecting for the BlogService
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
```
------
## Final Output:

Start application and you should be able to see output in browser *console window* :

>![blogdata](/readme_assets/output.png)
