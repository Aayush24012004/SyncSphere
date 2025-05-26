import User from "../models/user.js";
import FriendRequest from "../models/friendRequest.js";
export async function getRecommendedUsers(req, res) {
  try {
    const currentUser = req.user;
    const currentUserId = req.user.id;
    const recommendedUsers = User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user's friend
        { $id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });
    return res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in recommended user", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
export async function getMyFriends(req, res) {
  try {
    const currentUser = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );
    res.status(200).json(currentUser.friends);
  } catch (error) {
    console.log("Error in getMyFriends", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;
    if (myId === recipientId)
      res
        .status(400)
        .json({ message: "You can not send friend request to yourself" });
    const recipient = await User.findById(recipientId);
    if (!recipient) res.status(404).json({ message: "User not found" });
    if (recipient.friends.includes(myId))
      res
        .status(400)
        .json({ message: "You are already friends with the user" });
    const existingRequest = FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    if (existingRequest) {
      res.status(400).json({
        message: "Friend request already exists between you and the user",
      });
    }
    const friendRequest = FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("Error in friendRequest", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      res.status(404).json({ message: "Friend Request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      res
        .status(403)
        .json({ message: "You are not authorized to access this request" });
    }
    friendRequest.status = "accepted";
    await friendRequest.save();
    //$addToSet will add elements to an array only if theey do not already exist
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: {
        friends: friendRequest.recipient,
      },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: {
        friends: friendRequest.sender,
      },
    });
    res.status(200).json({ message: "Friend Request accepted" });
  } catch (error) {
    console.log("Error in acceptfriendRequest", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
export async function getFriendRequest(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sende", "fullName profilePic nativeLanguage learningLanguage");
    const acceptedRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "accepted",
    }).populate("sende", "fullName profilePic");
    res.status(200).json(incomingRequests, acceptedRequests);
  } catch (error) {
    console.log("Error in getFriendRequest", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
export async function getOutGoingFriendRequest(req, res) {
  try {
    const getOutGoingRequest = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    res.status(200).json(getOutGoingRequest);
  } catch (error) {
    console.log("Error in getFriendRequest", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
