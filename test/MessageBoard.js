const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MessageBoard", function () {
  let MessageBoard;
  let messageBoard;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the contract factory and signers
    MessageBoard = await ethers.getContractFactory("MessageBoard");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    messageBoard = await MessageBoard.deploy();
  });

  describe("Posting Messages", function () {
    it("Should allow a user to post a message", async function () {
      const messageText = "Hello, Web3 world!";
      await messageBoard.connect(addr1).postMessage(messageText);

      // Check message was stored correctly
      const messages = await messageBoard.getAllMessages();
      expect(messages.length).to.equal(1);
      expect(messages[0].sender).to.equal(addr1.address);
      expect(messages[0].text).to.equal(messageText);
      expect(messages[0].likes).to.equal(0);
    });

    it("Should emit MessagePosted event when a new message is posted", async function () {
      const messageText = "Hello, Web3 world!";
    
      await expect(messageBoard.connect(addr1).postMessage(messageText))
        .to.emit(messageBoard, "MessagePosted")
        .withArgs(0, addr1.address, messageText, (timestamp) => {
          return typeof timestamp === 'bigint' && timestamp > 0n;
        });
    });

    it("Should not allow a user to post more than once within the cooldown period", async function () {
      const messageText1 = "First message";
      const messageText2 = "Second message - should fail";
      
      await messageBoard.connect(addr1).postMessage(messageText1);
      
      // Try to post a second message right away
      await expect(
        messageBoard.connect(addr1).postMessage(messageText2)
      ).to.be.revertedWith("Please wait before posting again");
    });
  });

  describe("Liking Messages", function () {
    beforeEach(async function () {
      // Post a message from addr1 first
      await messageBoard.connect(addr1).postMessage("A message to like");
    });

    it("Should allow a user to like someone else's message", async function () {
      // addr2 likes addr1's message
      await messageBoard.connect(addr2).likeMessage(0);
      
      // Check like was counted
      const messages = await messageBoard.getAllMessages();
      expect(messages[0].likes).to.equal(1);
      
      // Check if user has liked the message
      const hasLiked = await messageBoard.hasUserLikedMessage(addr2.address, 0);
      expect(hasLiked).to.be.true;
    });

    it("Should not allow a user to like their own message", async function () {
      // addr1 tries to like their own message
      await expect(
        messageBoard.connect(addr1).likeMessage(0)
      ).to.be.revertedWith("You cannot like your own message");
    });

    it("Should not allow a user to like the same message twice", async function () {
      // addr2 likes addr1's message
      await messageBoard.connect(addr2).likeMessage(0);
      
      // Try to like it again
      await expect(
        messageBoard.connect(addr2).likeMessage(0)
      ).to.be.revertedWith("You have already liked this message");
    });

    it("Should emit MessageLiked event when a message is liked", async function () {
      await expect(messageBoard.connect(addr2).likeMessage(0))
        .to.emit(messageBoard, "MessageLiked")
        .withArgs(0, addr2.address, 1);
    });
  });
});
