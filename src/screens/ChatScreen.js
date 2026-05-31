import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../constants/theme';
import { Icon } from '../components/Icons';
import Screen from '../components/Screen';

const INITIAL_MESSAGES = [
  { id: 0, from: 'support', text: 'Hej\u{1F44B}\nCo możemy zrobić\ndla Ciebie?' },
];

const AUTO_REPLIES = [
  'Dziękujemy za wiadomość! Nasz konsultant odpowie wkrótce.',
  'Rozumiemy. Czy możesz podać więcej szczegółów?',
  'Pracujemy nad tym. Proszę o cierpliwość!',
  'Czy jest coś jeszcze, w czym mogę pomóc?',
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [text, setText] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const scrollRef = useRef(null);
  const replyIndex = useRef(0);

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { id: Date.now(), from: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setText('');

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        from: 'support',
        text: AUTO_REPLIES[replyIndex.current % AUTO_REPLIES.length],
      };
      replyIndex.current++;
      setMessages(prev => [...prev, reply]);
    }, 1200);
  };

  if (!chatOpen) {
    return (
      <Screen>
        <Text style={s.title}>Chat</Text>
        <View style={s.chatPreview}>
          <View style={s.msgRow}>
            <View style={s.avatar}>
              <Icon name="user" size={16} color="#1a1530" />
            </View>
            <View style={s.bubble}>
              <Text style={s.bubbleText}>{'Hej\u{1F44B}\nCo możemy zrobić\ndla Ciebie?'}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={s.openBtn} onPress={() => setChatOpen(true)} activeOpacity={0.8}>
          <Text style={s.openBtnText}>Napisz do nas</Text>
        </TouchableOpacity>
      </Screen>
    );
  }

  return (
    <Screen noPadding>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={s.header}>
          <TouchableOpacity onPress={() => setChatOpen(false)}>
            <Icon name="back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Chat z obsługą</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          ref={scrollRef}
          style={s.messagesWrap}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => (
            <View key={msg.id} style={[s.msgContainer, msg.from === 'user' && s.msgContainerUser]}>
              {msg.from === 'support' && (
                <View style={s.avatar}>
                  <Icon name="user" size={14} color="#1a1530" />
                </View>
              )}
              <View style={[s.msgBubble, msg.from === 'user' ? s.userBubble : s.supportBubble]}>
                <Text style={[s.msgText, msg.from === 'user' ? s.userText : s.supportText]}>{msg.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={s.inputBar}>
          <TextInput
            style={s.chatInput}
            value={text}
            onChangeText={setText}
            placeholder="Napisz wiadomość..."
            placeholderTextColor={COLORS.textMute}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity style={s.sendBtn} onPress={sendMessage} disabled={!text.trim()}>
            <Text style={[s.sendIcon, !text.trim() && { opacity: 0.3 }]}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { color: COLORS.text, fontWeight: '800', fontSize: 20, textAlign: 'center', marginBottom: 12, paddingHorizontal: 20, paddingTop: 16 },
  chatPreview: {
    flex: 1, borderWidth: 1, borderColor: COLORS.cyanBright, borderRadius: 14,
    padding: 14, backgroundColor: 'rgba(34,211,238,0.04)', marginHorizontal: 20,
  },
  msgRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  openBtn: {
    backgroundColor: '#fff', paddingVertical: 13, borderRadius: 22, alignItems: 'center',
    marginTop: 12, marginHorizontal: 20, marginBottom: 12,
  },
  openBtnText: { color: '#1a1530', fontWeight: '700', fontSize: 14 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { color: COLORS.text, fontWeight: '800', fontSize: 16 },

  messagesWrap: { flex: 1 },
  msgContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 },
  msgContainerUser: { flexDirection: 'row-reverse' },
  avatar: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#d9d9d9',
    alignItems: 'center', justifyContent: 'center',
  },
  msgBubble: { borderRadius: 14, padding: 10, paddingHorizontal: 14, maxWidth: '75%' },
  supportBubble: { backgroundColor: '#fff' },
  userBubble: { backgroundColor: COLORS.primary },
  msgText: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  supportText: { color: '#1a1530' },
  userText: { color: '#fff' },
  bubble: { backgroundColor: '#fff', borderRadius: 10, padding: 10, paddingHorizontal: 12, maxWidth: 200 },
  bubbleText: { color: '#1a1530', fontSize: 13, fontWeight: '700', lineHeight: 18 },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.bgCard,
  },
  chatInput: {
    flex: 1, backgroundColor: COLORS.bgCardSoft, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, color: COLORS.text,
    fontSize: 14, fontWeight: '500', maxHeight: 100,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendIcon: { color: '#fff', fontSize: 18 },
});
