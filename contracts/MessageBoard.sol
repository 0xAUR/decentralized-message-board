// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MessageBoard {
    // Structure for messages
    struct Message {
        address sender;
        string text;
        uint256 timestamp;
        uint256 likes;
    }

    // Array to store all messages
    Message[] public messages;
    
    // Mapping to track last post time for each user (for rate limiting)
    mapping(address => uint256) public lastPostTime;
    
    // Mapping to track if a user has liked a message
    mapping(address => mapping(uint256 => bool)) public hasLiked;
    
    // Time limit between posts (1 hour in seconds)
    uint256 public constant POST_COOLDOWN = 1 hours;
    
    // Events
    event MessagePosted(uint256 indexed messageId, address indexed sender, string text, uint256 timestamp);
    event MessageLiked(uint256 indexed messageId, address indexed liker, uint256 newLikeCount);
    
    // Post a new message
    function postMessage(string memory _text) external {
        // Check if user is allowed to post (rate limiting)
        require(
            block.timestamp >= lastPostTime[msg.sender] + POST_COOLDOWN || lastPostTime[msg.sender] == 0,
            "Please wait before posting again"
        );
        
        // Add new message to the array
        uint256 messageId = messages.length;
        messages.push(Message({
            sender: msg.sender,
            text: _text,
            timestamp: block.timestamp,
            likes: 0
        }));
        
        // Update last post time for rate limiting
        lastPostTime[msg.sender] = block.timestamp;
        
        // Emit event
        emit MessagePosted(messageId, msg.sender, _text, block.timestamp);
    }
    
    // Like a message
    function likeMessage(uint256 _messageId) external {
        require(_messageId < messages.length, "Message does not exist");
        require(!hasLiked[msg.sender][_messageId], "You have already liked this message");
        require(messages[_messageId].sender != msg.sender, "You cannot like your own message");
        
        // Mark message as liked by this user
        hasLiked[msg.sender][_messageId] = true;
        
        // Increment like count
        messages[_messageId].likes += 1;
        
        // Emit event
        emit MessageLiked(_messageId, msg.sender, messages[_messageId].likes);
    }
    
    // Get all messages (for frontend display)
    function getAllMessages() external view returns (Message[] memory) {
        return messages;
    }
    
    // Get total number of messages
    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }
    
    // Check if a user has liked a specific message
    function hasUserLikedMessage(address _user, uint256 _messageId) external view returns (bool) {
        require(_messageId < messages.length, "Message does not exist");
        return hasLiked[_user][_messageId];
    }
}
