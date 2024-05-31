package com.example.chatapplication.chat;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class ChatController {
    // 1. 사용자 추가
    // 2. 메세지를 보내는 방법

    // 메세지 보내기 메서드
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")    //config 에서 설정한 접두사
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage){
        return chatMessage;
    }

    
    // 웹소켓 세션에 사용자 추가
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor){
        log.info("컨트롤러");
        headerAccessor.getSessionAttributes().put("username" , chatMessage.getSender());
        return chatMessage;

    }
}
