# Vite + Firebase Chat App (React + TypeScript)
This is a simple real-time chat application built with Vite, React, Firebase, and Chakra UI.

## Features
✅ Google Authentication 
✅ Email + password Authentication  
✅ Real-time chat using Firestore  
✅ Profile picture upload using Firebase Storage  
✅ Responsive UI with Chakra UI


## DB structure
📂 Firestore Database
 ├── 📁 users
 │   ├── 📄 {uid}
 │   │   ├── displayName: string
 │   │   ├── email: string
 │   │   ├── imageUrl: string (profile picture)
 │   │   ├── isGoogleUser: boolean
 │
 ├── 📁 chatRooms
 │   ├── 📄 {roomId}
 │   │   ├── name: string (room name)
 │   │   ├── messages (subcollection)
 │   │   │   ├── 📄 {messageId}
 │   │   │   │   ├── senderId: string (userId of sender)
 │   │   │   │   ├── text: string
 │   │   │   │   ├── timestamp: timestamp

storage has /uploads folder for images


## Considerations
1. auth - used Firebase auth, is done with context. needed userDetails for all users so I created Users table.  
2. state - went with react query, I wanted to subscribe to Users table so that if a user changes the profile picture it will be seen by all, needed it in a few places so used react query for that, also needed the chatrooms names in 2 components so got that with react query. the reason for this is that I wanted the app routing to include all the relevant data so if a user gets a link to a chatRoom they can click it and see everything (if authenticated) so the global data is fetched in ProtectedRoute, all the rest is incapsulated loacaly inside components. for example subscribing to messages from firestore is local to MessageList.
3. stored userDetails as an object in order to have O(1) lookup on it for message display.
4. created Login page/ signup page with formik and yup. also allowed google signin this page uses routing in order to decide what to display.
5. added the ability for users to add and replace image with firebse storage.
6. used chakra ui for basic styling.

## Possible improvements
1. we can add user details page
2. can add a feature to say that somone just entered the chatroom
3. can add a [name] is typing feature
4. can add invite abilities
5. can let users create chat rooms
6. who is online feature
7. direct message feature

## Installation
1. Clone the repository  
2. Run `npm install`  
3. Create a `.env` file and add your Firebase config  (see .env.example)
4. Start the app: `npm run dev`  

## Testing
if I would have more time I would use vite tests  

🚀 Enjoy your real-time chat app!
