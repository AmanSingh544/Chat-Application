import Picker from 'emoji-picker-react';
import React, { useState, useRef } from "react";
import getCaretCoordinates from "textarea-caret";
import {
  Box,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AvatarLogo from './Avatars';
import { deepOrange } from '@mui/material/colors';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = ({ onSend, emitTyping, roomMembers }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [suggestionDropDownPosition, setSuggestionDropDownPosition] = useState({
    top: 0,
    left: 0,
  });

  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
      setShowSuggestions(false);
      emitTyping(false);
    }
  };

  const showSuggestionsAtCaret = (e) => {
    const coords = getCaretCoordinates(e.target, e.target.selectionStart);
    const rect = e.target.getBoundingClientRect();
    setSuggestionDropDownPosition({
      top: rect.top + coords.top + 25,
      left: coords.left,
    });
  };

  const handleTyping = (e) => {
    const val = e.target.value;
    setInput(val);
    emitTyping(val.length > 0);

    const match = val.match(/@(\w*)$/);
    if (match) {
      showSuggestionsAtCaret(e);
      const query = match[1].toLowerCase();
      const filtered = roomMembers.filter((member) =>
        member?.username.toLowerCase().startsWith(query)
      );
      setFilteredMembers(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (member) => {
    const newText = input.replace(/@(\w*)$/, `@${member} `);
    setInput(newText);
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    inputRef.current.focus();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        position: "relative",
        padding: 0.5,
        backgroundColor: "#f8f8f8",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <IconButton onClick={() => setShowPicker((prev) => !prev)} size="small">
          <EmojiEmotionsIcon />
        </IconButton>
        {showPicker && (
          <Box
            sx={{
              position: "absolute",
              bottom: "40px",
              left: 0,
              zIndex: 1500,
              boxShadow: 3,
            }}
          >
            <Picker onEmojiClick={onEmojiClick} />
          </Box>
        )}
      </Box>

      <TextField
        inputRef={inputRef}
        value={input}
        onChange={handleTyping}
        onFocus={() => emitTyping(true)}
        onBlur={() => emitTyping(false)}
        multiline
        maxRows={3}
        minRows={1}
        fullWidth
        placeholder="Type a message..."
        variant="outlined"
        size="small"
        sx={{ flexGrow: 1 }}
      />

      <Button variant="contained" onClick={handleSend}>
        <SendIcon />
      </Button>

      {showSuggestions && (
        <Paper
          sx={{
            position: "absolute",
            //top: suggestionDropDownPosition.top,
            left: suggestionDropDownPosition.left + 40,
            bottom: "40px",
            width: 220,
            maxHeight: 200,
            overflowY: "auto",
            zIndex: 1600,
            boxShadow: 5,
          }}
        >
          <List dense disablePadding>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                <ListItem key={index} onMouseDown={() => handleSelectSuggestion(member?.username)}>
                    <ListItemButton onMouseDown={() => handleSelectSuggestion(member.username)}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AvatarLogo tooltipTitle={""}
                          avatarText={member?.username[0].toUpperCase()}
                          index={index}
                        />
                        <ListItemText primary={member.username} />
                      </Box>
                    </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No users found" />
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default MessageInput;
