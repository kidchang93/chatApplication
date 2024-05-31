package com.example.chatapplication.config;

import com.example.chatapplication.chat.ChatMessage;
import com.example.chatapplication.chat.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {
    // 사용자가 입장하거나 나갔을 때 알리고 싶어서 만드는 기능

    //
    private final SimpMessageSendingOperations messageTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener (SessionDisconnectEvent event ){

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null){
            log.info("User disconnected: " + username);
            var chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .sender(username)
                    .build();
            // 메시지 템플릿을 변환하고 페이로드로 보내는것.
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}
