# Streaming Comments with Spring WebFlux Sinks and SSE

In this lesson, we'll learn how to implement real-time comment streaming in our blog application. We'll use Spring WebFlux's Functional Routes, `Sinks`, and Server-Sent Events (SSE).

## 1. The Core Implementation: Producing and Consuming

### 1.1 Producing Events: Adding a Comment

When a new comment is added, we don't just want to save it to the database; we want to immediately broadcast it to any client listening for new comments on that specific post.

Here is our implementation in `CommentService`:

```java
public Mono<Comment> addComment(String slug, Comment comment) {
    return postRepository.findBySlug(slug)
            .flatMap(post -> {
                comment.setPostId(post.getId());
                return commentRepository.save(comment)
                        .doOnNext(savedComment -> {
                            // This is where the magic happens!
                            Sinks.EmitResult result = commentSink.tryEmitNext(savedComment);
                            if (result.isFailure()) {
                                System.err.println("[CommentService] Failed to emit comment: " + result);
                            }
                        });
            });
}
```

### 1.2 Consuming Events: The Comment Stream

To listen for new comments on a specific post, we need a way to access the `Sink` as a `Flux` and filter it.

Here is the implementation of `getCommentStream` in `CommentService`:

```java
public Flux<Comment> getCommentStream(String slug) {
    return postRepository.findBySlug(slug)
            .flatMapMany(post -> commentSink.asFlux()
                    .filter(comment -> comment.getPostId().equals(post.getId())));
}
```

This method first finds the post by its slug to get its ID. Then, it converts the `commentSink` into a `Flux` using `asFlux()`. Because our sink is configured for **multicast**, every new subscriber will receive the elements emitted to it. We then `filter` the stream so that the client only receives comments that match the `postId` of the requested post.

## 2. Setting up the Functional Route

We chose to use **Functional Routes** (via `RouterFunction`) instead of traditional `@RestController` annotations. 

### Why Functional Routes?
- **Explicit over Implicit**: You can see all your routes in one place (`BlogRoutes.java`).
- **Better Composition**: It's easier to group routes, apply filters (like authentication or logging) to specific sub-paths, and handle complex routing logic programmatically.
- **Immutability and Testability**: Router functions are easy to test in isolation without starting a full web context.

In `BlogRoutes.java`, we define the SSE endpoint:

```java
@Bean
public RouterFunction<ServerResponse> sseRoutes(CommentHandler commentHandler) {
    return RouterFunctions.route()
            .path(apiPrefix, builder -> builder
                    .GET("/sse/posts/{slug}/comments/stream", commentHandler::streamComments)
            )
            .build();
}
```

## 3. Deep Dive into Sinks

### What is a Sink?
A `Sink` is a construct in Project Reactor that allows you to programmatically "push" data into a reactive stream. While a standard `Flux` is usually created from a static source (like a database or a collection), a `Sink` acts as a bridge between non-reactive code (or imperative events) and the reactive world.

### Sinks.Many and Multicast
In `CommentService`, we initialize our sink like this:

```java
this.commentSink = Sinks.many().multicast().onBackpressureBuffer(Queues.XS_BUFFER_SIZE, false);
```

- **`Sinks.many()`**: This indicates that the sink can emit multiple elements (a `Flux`).
- **`multicast()`**: This is crucial. It means that the signals emitted to this sink will be "broadcast" to **all** active subscribers. If we used `unicast()`, only one subscriber could listen at a time.
- **`onBackpressureBuffer()`**: This defines what happens if the sink emits faster than the subscribers can consume. Here, we use a small buffer to hold pending comments.

### Why Sinks are cool?
Sinks allow for a **decoupled architecture**. The `addComment` method doesn't need to know who is listening or how many clients are connected. It just "emits" the event, and the sink handles the distribution to all interested parties. This is much cleaner than manually managing a list of subscribers.

## 4. Exposing the Stream via SSE

To send these events to the browser, we use **Server-Sent Events (SSE)**. SSE is a standard that allows servers to push data to web pages over HTTP.

In `CommentHandler::streamComments`, we transform our Sink's Flux into an SSE stream:

```java
public Mono<ServerResponse> streamComments(ServerRequest request) {
    String slug = request.pathVariable("slug");

    Flux<ServerSentEvent<Comment>> sseFlux = commentService.getCommentStream(slug)
            .map(comment -> ServerSentEvent.<Comment>builder()
                    .data(comment)
                    .event("comment-added")
                    .build()
            );

    // Heartbeat to keep the connection alive
    Flux<ServerSentEvent<Comment>> heartbeat = Flux.interval(Duration.ofSeconds(15))
            .map(i -> ServerSentEvent.<Comment>builder()
                    .event("keep-alive")
                    .build());

    Flux<ServerSentEvent<Comment>> mergedFlux = Flux.merge(sseFlux, heartbeat);

    return ServerResponse.ok()
            .contentType(MediaType.TEXT_EVENT_STREAM)
            .body(mergedFlux, ServerSentEvent.class);
}
```

We use `MediaType.TEXT_EVENT_STREAM` to tell the browser to expect a persistent connection for events. We also merge a "heartbeat" flux to prevent routers or proxies from closing the connection due to inactivity.

## Advice and Suggestions

1.  **Scaling with Sinks**: Currently, we use a single `commentSink` for ALL posts and filter by `postId` in `getCommentStream`. For a high-traffic site, it's better to use a `Map<String, Sinks.Many<Comment>>` to have a dedicated sink per post. This avoids unnecessary filtering and reduces the load on the global sink.
2.  **Error Handling**: Always check the `EmitResult` when calling `tryEmitNext`. If it fails (e.g., due to overflow), you might want to log it or implement a retry strategy.
3.  **Security**: Don't forget to apply the same security rules to your SSE endpoints as you do to your regular REST endpoints.
4.  **Client-Side Reconnection**: SSE has built-in reconnection logic in the browser (`EventSource`). Ensure your backend can handle clients reconnecting and potentially missing events if they were offline.
