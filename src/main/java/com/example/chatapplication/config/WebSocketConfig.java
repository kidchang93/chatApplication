package com.example.chatapplication.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker   // Websocket 메시지 브로커를 활성화 하기 위한 어노테이션
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    // WebSocketConfig은 WebSocketMessageBrokerConfigurer 를 구현.
    // 두가지 기본 메서드가 있음. ( 1. registerStompEndpoints 2. configureMessageBroker )
    // 이 두가지를 재정의한다.

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 이 곳에서 stomp 및 엔드포인트를 구성하기 시작.
        //  Http or https 와 같은 보안 웹소켓으로 작업하려는 경우에도 웹 소켓을 의미하는 경로인 /wss 가 제공되야 한다.
        registry.addEndpoint("/ws").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
    }
}
