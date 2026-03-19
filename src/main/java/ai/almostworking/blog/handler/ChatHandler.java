package ai.almostworking.blog.handler;

import ai.almostworking.blog.model.Chat;
import ai.almostworking.blog.model.Post;
import ai.almostworking.blog.service.ChatService;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URI;

@Service
public class ChatHandler {
    private final ChatService chatService;

    public ChatHandler(ChatService chatService) {
        this.chatService = chatService;
    }

    public Mono<ServerResponse> chat(ServerRequest serverRequest) {
        return ServerResponse.ok().body(chatService.getAllChats(), Chat.class);
    }

    public Mono<ServerResponse> postChat(ServerRequest request) {
        return request.bodyToMono(Chat.class)
                .flatMap(chatService::saveChat)
                .flatMap(chat -> ServerResponse.created(URI.create(request.path() + "/" + chat.getId()))
                        .bodyValue(chat));
    }

    public Mono<ServerResponse> deleteChat(ServerRequest request) {
        Long id = Long.parseLong(request.pathVariable("id"));
        return chatService.deleteChat(id)
                .then(ServerResponse.noContent().build());
    }

    public Mono<ServerResponse> streamChats(ServerRequest serverRequest) {
        //Flux<ServerSentEvent<Post>> sseFlux
        Flux<ServerSentEvent<Chat>> sseFlux = chatService.getChatStream()
                .doOnNext(chat -> System.out.println("[SSE] Emitting chat event for: " + chat.getId()))
                .map(chat -> ServerSentEvent.<Chat>builder()
                        .data(chat)
                        .event("chat-added")
                        .build()
                );

        return ServerResponse.ok()
                .header("Cache-Control", "no-cache")
                .header("X-Accel-Buffering", "no")
                .body(sseFlux, ServerSentEvent.class);
    }
}
