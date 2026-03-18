# Building a Reactive Blog Backend with Spring Boot and R2DBC

This document outlines the step-by-step journey of building a reactive blog backend service, from initial database design to robust error handling and validation.

## Step 1: Designing the Core Schema
**Prompt:**
"I need a sql schema for a blog backend. Set up Liquibase for database migrations." 
```oracle
CREATE TABLE post (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    start_date TIMESTAMP
    
);
```

---

## Step 2: Adding Comments and Audit Timestamps
**Prompt:**
"now we need a table for comments. for the post table, we might need a column for update date. What are the best practices?"

**Actions:**
- Added `updated_at` column to the `post` table with `DEFAULT CURRENT_TIMESTAMP`.
- Created a `comment` table with a foreign key to `post`.
- Implemented indexing on `post_id` for performance.
- Enabled `ON DELETE CASCADE` to ensure data integrity.

---

## Step 3: Mapping Models to R2DBC
**Prompt:**
"since i am using r2dbc could we link the models in the model package to the tables from liquibase we just created? I think they need the Table annotation"

**Actions:**
- Added `@Table("post")` and `@Table("comment")` annotations.
- Marked primary keys with `@Id`.
- Configured the models to work seamlessly with Spring Data R2DBC's naming strategy.

---

## Step 4: Creating Reactive Repositories
**Prompt:**
"now create the repository for the comments and posts according to the best practices."

**Actions:**
- Created `PostRepository` and `CommentRepository` extending `R2dbcRepository`.
- Added reactive query methods like `findAllByPostId` for comment retrieval.

---

## Step 5: Implementing CRUD Routes and Handlers
**Prompt:**
"please implement these methods"
```java
.POST("/posts", postHandler::createPost)
.GET("/posts/{id}", postHandler::getPostById)
.PUT("/posts/{id}", postHandler::updatePost)
.DELETE("/posts/{id}", postHandler::deletePost)
```

**Actions:**
- Implemented `BlogService` for business logic.
- Created `PostHandler` for processing reactive HTTP requests.
- Configured `BlogRoutes` using the Functional Routing API.

---

## Step 6: Improving SEO with Slugs
**Prompt:**
"i don't know if i like \"/posts/\" + post.getId()\" where id is a long, maybe we should create a slug instead so that it is a little bit more readable and easier. Could we please modify the models and the routes and the tables in liquibase. Please feel free to modify the sql directly instead of altering tables with new files because we are in dev mode."

**Actions:**
- Replaced numeric ID routing with unique `slug` strings.
- Updated the database schema and repository to support slug-based lookups.
- Refactored service and handler layers to use slugs for identification.

---

## Step 7: Automated Slug Generation
**Prompt:**
"OK, but let's think logically, do we really expect the creator of th post to also create the slug? We should be creating the slug for the post from the title. So let's think, when somone creates a post, the slug should be optional and we should generate it automatically based on the title if it does not exist. Also, let's extract the slug creating login in a separate service"

**Actions:**
- Created a `SlugService` to normalize titles into URL-friendly slugs.
- Modified `BlogService` to automatically generate slugs during post creation and updates.

---

## Step 8: Testing with HTTP Client
**Prompt:**
"ok, let's test, could you create me file in scratchpad to test this? in scratches i created the temp folder, let's create the http requests there to test our apis"

**Actions:**
- Created `scratches/temp/test-posts.http` with a full suite of integration test cases.

---

## Step 9: Robust Error Handling (409 Conflict)
**Prompt:**
"This is all good. Let's try to make it more resilient. at the moment if i am making a new post with the exact same title I am getting a 500 ... what are the best practices to handle these types of scenarios?"

**Actions:**
- Introduced `PostAlreadyExistsException`.
- Created a structured `ErrorResponse` JSON model.
- Mapped database `DuplicateKeyException` to HTTP `409 Conflict`.

---

## Step 10: Input Validation (400 Bad Request)
**Prompt:**
"ok, let's make our post creation process more robust. If i sent no title it fails, can we create custom exception to handle this scenario?"

**Actions:**
- Added title presence validation.
- Created `InvalidPostException`.
- Mapped validation failures to HTTP `400 Bad Request`.

---

## Step 11: Decoupling Validation Logic
**Prompt:**
"OK, when we create the post, I would like this code ... to be executed in some validation service before we go to createPost in the BlogService. That is we need to run sanity checks in another service"

**Actions:**
- Extracted validation logic into `PostValidationService`.
- Refactored `PostHandler` to pipe requests through validation before hitting the business service.

---

## Step 12: Implementing Comments Endpoints
**Prompt:**
"now in the BlogRoutes we want to create the endpoints for comments as well. Remember comments belong to a post, in a one post can have many comments. We want to be able to add a comment, update it and delete it."

**Actions:**
- Created `CommentService` to handle comment business logic and link comments to posts via their slug.
- Created `CommentValidationService` to ensure author and content are provided.
- Implemented `CommentHandler` with reactive endpoints.
- Updated `BlogRoutes` with a nested structure for comment management:
    - `GET /posts/{slug}/comments`: List all comments for a post.
    - `POST /posts/{slug}/comments`: Add a new comment to a post.
    - `PUT /posts/{slug}/comments/{id}`: Update an existing comment.
    - `DELETE /posts/{slug}/comments/{id}`: Remove a comment.
- Created `scratches/temp/test-comments.http` to test the new endpoints.
- Documented the changes in `steps.md`.

---

## Step 13: Adding Real-Time Comments with SSE
**Prompt:**
"can we add an endpoint for the comments which will be SSE server streamed events. i want the subscribers to see the new comments as soon as they are available: like when someone comments on a post in real time. how do we do that? please add a new RouterFunction instead of modifying the existing working ones"

**Actions:**
- Integrated `Sinks.Many` into `CommentService` to broadcast new comments to all active subscribers.
- Implemented `getCommentStream` in `CommentService` to filter the broadcast by post slug.
- Added `streamComments` to `CommentHandler` to return a `Flux<ServerSentEvent<Comment>>`.
- Configured a separate `sseRoutes` RouterFunction bean in `BlogRoutes` to handle real-time streaming at `/sse/posts/{slug}/comments/stream`.
- Created `scratches/temp/test-sse.http` for verification.

---

## Step 14: Streaming All New Posts with SSE
**Prompt:**
"implement in the same way .GET("/sse/posts/stream", commentHandler::streamPosts)"

**Actions:**
- Added a `postSink` to `BlogService` to broadcast all newly created posts.
- Implemented `getPostStream` in `BlogService` returning a `Flux<Post>`.
- Updated `CommentHandler` to inject `BlogService` and handle `streamPosts`.
- Configured the new route in `BlogRoutes` at `/sse/posts/stream`.
- Added test cases to `scratches/temp/test-sse.http` to verify real-time post streaming.

---

## Step 15: Kustomize Overlays for Local and Hetzner
**Prompt:**
"I have k8s folder for deployment into k8s with kustomize. It works fine in the local environment, but i would like to have an overlay for hetzner cloud. Since I have postgres database dependency, i need something like this for the hetzner overlay: a persistent volume claim ... and I don't know but we probably need to change the stateful set so that we could have volumes ... could you please do the overlays, one for local, with current setul and another one for hetzner"

**Actions:**
- Refactored the `k8s/` directory into a `base` and `overlays` structure.
- Created `k8s/base` containing the core resources (be, fe, db).
- Implemented `k8s/overlays/local` with a specific `statefulset.yaml` preserving the original `volumeClaimTemplates` setup.
- Created `k8s/overlays/hetzner` with:
    - A dedicated `PersistentVolumeClaim` named `postgres-pvc`.
    - A specific `statefulset.yaml` that uses the manual PVC via a `volumes` entry, avoiding complex patches.
- Updated both overlays to explicitly manage the `blog-namespace`.
- Removed the shared `statefulset.yaml` from `k8s/base/db` to prevent unwanted inheritance and ensure clean isolation between environments.
- Added a root `k8s/kustomization.yaml` that defaults to the `local` overlay for backward compatibility.

---

## Step 16: Switch to Dockerfile for AMD64 Build
**Prompt:**
"ok, could you please create me the dockerfile for the BE or what would you recommend me do?"

**Actions:**
- Identified that `bootBuildImage` (Paketo) on ARM Mac produced architecture-mismatched binaries for `amd64`.
- Created a multi-stage `Dockerfile` in the root to manually build the Spring Boot JAR and create a clean `amd64` image.
- Implemented `build-be.sh` script to automate building with `--platform linux/amd64` and pushing the image.
- Documented the transition from Spring Boot's internal builder to an explicit `Dockerfile` for better platform control.
