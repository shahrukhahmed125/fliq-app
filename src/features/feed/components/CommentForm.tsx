import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { postService } from '../../../services/postService';

function CommentForm({
  postUuid,
  replyTo,
  onCancelReply,
  onCommentAdded,
}: {
  postUuid: string;
  replyTo: any;
  onCancelReply: () => void;
  onCommentAdded: (comment: any) => void;
}) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      const commentData: any = {
        content: text,
      };

      if (replyTo) {
        commentData.parent_id = replyTo.id;
      }

      const response = await postService.createComment(postUuid, commentData);
      setText('');
      onCancelReply();
      onCommentAdded(response);
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {replyTo && (
        <View style={styles.replyToContainer}>
          <Text style={styles.replyToText}>
            Replying to <Text style={styles.replyToName}>{replyTo?.user?.name}</Text>
          </Text>
          <TouchableOpacity onPress={onCancelReply}>
            <Text style={styles.cancelReply}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          multiline
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.submitButton, (!text.trim() || isLoading) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!text.trim() || isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Sending...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  replyToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  replyToText: {
    fontSize: 12,
    color: '#666',
  },
  replyToName: {
    fontWeight: 'bold',
    color: '#111',
  },
  cancelReply: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
    color: '#111',
    maxHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CommentForm;
