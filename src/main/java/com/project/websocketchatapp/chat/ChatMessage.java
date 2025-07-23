package com.project.websocketchatapp.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChatMessage {
    private MessageType messageType;
    private String content;
    private String sender;
    private String recipient;
}
