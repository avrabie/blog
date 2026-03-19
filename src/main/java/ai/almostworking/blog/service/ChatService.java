package ai.almostworking.blog.service;

import ai.almostworking.blog.model.Chat;
import ai.almostworking.blog.repository.ChatRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final Sinks.Many<Chat> chatSink;

    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
        this.chatSink = Sinks.many().multicast().onBackpressureBuffer(100,false);
    }

    public Flux<Chat> getAllChats() {
        return chatRepository.findTop10ByOrderByCreatedAtDesc()
                .collectList()
                .flatMapMany(list -> {
                    List<Chat> reversedList = new ArrayList<>(list);
                    Collections.reverse(reversedList);
                    return Flux.fromIterable(reversedList);
                });
    }

    public Mono<Chat> saveChat(Chat chat) {
        return chatRepository.save(chat)
                .doOnNext(chatSink::tryEmitNext);
    }

    public Mono<Void> deleteChat(Long id) {
        return chatRepository.deleteById(id);
    }

    public Flux<Chat> getChatStream() {
        return chatSink.asFlux();
    }
}
