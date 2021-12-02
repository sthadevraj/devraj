import {SearchIcon} from "@heroicons/react/outline";
import {DotsHorizontalIcon,VideoCameraIcon} from  "@heroicons/react/solid";
import Contact from "./Contact";
import {useCollection} from "react-firebase-hooks/firestore";
import {db,storage} from "../firebases";
import {useEffect,useState} from 'react';
const Widgets=({session})=>{
	const[chats,setChats]=useState([]);
	const[myChat,setMyChat]=useState([]);
    const [myChats]=useCollection(db.collection('chats').where('users','array-contains',session?.user?.email));
		 useEffect(()=>{
      myChats?.docs?.map((user)=>{
        setMyChat((prevState)=>[...prevState,user.id]);
        db.collection('chats').doc(user.id).collection('messeges').orderBy('timestamp','asc').limitToLast(1)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                setChats((prev)=>[...prev,doc]);
            })

        })
    })
  },[myChats]);
return(
	<>
	<div className="hidden lg:flex flex-col w-60 p-2 mt-5"> 
	<div className="flex justify-between items-center text-gray-500 mb-5"> 
	<h2 className="text-xl">Contacts</h2> 
	<div className="flex space-x-2"> 
	<VideoCameraIcon className="h-6"></VideoCameraIcon> 
	<SearchIcon className="h-6"></SearchIcon> 
	<DotsHorizontalIcon className="h-6"></DotsHorizontalIcon> 
	</div> 
	</div> 
 		{
 	
 				chats?.map((user,i)=>{
 					// return <p>yyeyyyy</p>
 				return <Contact key={myChat[i]} id={myChat[i]} session={session}  name={user.data().user} messeges={chats} />
 				})
 			
 		}
 
 	</div>
 	</>
	)
}
export default Widgets;
