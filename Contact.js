import Image from 'next/image';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Modal from 'react-modal';
import {useCollection} from "react-firebase-hooks/firestore";
import {db,storage} from "../firebases";
import CameraIcon  from '@material-ui/icons/Camera'
import ModalBodyChat from './ModalBodyChat'
import {useState,useEffect,useRef} from 'react';
import TimeAgo from 'timeago-react';
import MicIcon from '@material-ui/icons/Mic';
import { css } from '@emotion/css';
import ScrollToBottom from 'react-scroll-to-bottom';
// import Button from '@material-ui/core/Button'
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import GetMessage from "../components/chats/GetMessage";
import Message from '../components/chats/Message';
import SendMessage from "../components/chats/SendMessage";
const Contact=({name,id,session})=>{
	const[isOpen,setIsOpen]=useState(false);
	const[chatImage,setChatImage]=useState([]);
	const[userId,setUserId]=useState(null);
	const filePickerRef=useRef(null);
	const chatRef=useRef(null);
	const[files,setFiles]=useState([null])
	const closeModal=()=>{
		setIsOpen(false);
	}
	const[recepientSnapshot]=useCollection(db.collection('users').where("email","==",name));
	const recepiant= recepientSnapshot?.docs?.[0]?.data();
	const chatList=[];
	chatList.push(recepiant);
	Modal.setAppElement('#__next')
	const modalStyle={
		content:{
			position:'relative',
			top: '63%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight : '-50%',
			transform   : 'translate(-50%, -50%)'
		}
	}
	const openModal=(e)=>{
		setIsOpen(true);
		const id=e.target.getAttribute('id');
		setUserId(id)
	}
	const handleFileUpload=(e)=>{
		setPostFiles([]);
		let id=Math.floor(Math.random()*(100-1)+2)
		for(let i=0;i<e.target.files.length;i++){
			let reader= new FileReader();
			const newFile=e.target.files[i];
			newFile["id"]=id;
			setFiles(prevState=>[...prevState,newFile]);
			reader.onload=(e)=>{
                    // console.log(e.target.result);
				setPostFiles((prevState)=>[...prevState,e.target.result])
			}
			reader.readAsDataURL(e.target.files[i]);
			setIsOpen(true);
		}
		setTotalImages(e.target.files.length);

	}
	const sendChat=(e)=>{

		e.preventDefault();
		if(chatRef==null)
			{
				console.log("empty field")
			}
		sendChat(id);
		if(files==null){
			console.log("null")
		}
		else{
			console.log("undefined");
		}
	}
	const removeImage=(i)=>{
		setFiles((OldData)=>{
			return OldData.filter((ele,index)=>{
                    return index!==i;
		})
	})
	}
	const RootCSS = css({
		height: 600,
	});
	const messageSnapshot = GetMessage(id);
	return(
		<>
		<div onClick={openModal} id={id}  className="flex items-center space-x-2 relative mb-2 hover:bg-gray-200 p-2 curser-pointer rounded-xl">

		{
			chatList?.map((user)=>{
				return(
					<>
					<img src={user?.profile} objectFit="cover" layout="fixed" className="rounded-full h-12 w-12"alt="image"/>
					<p>{name}</p>
					<div className="absolute bottom-2 left-7  bg-green-400 h-3 w-3 rounded-full animated-bounce"></div>
					<Modal isOpen={isOpen} onRequestClose={closeModal} style={modalStyle} contentLabel="Modal">
					<div className="flex flex-grow py-2 justify-between border-b">
					<div  className="flex space-x-2  items-center cursor-pointer ">
					<img src={user?.profile} height={40} width={40} layout="fixed"className="rounded-full px-4"alt="image"/>
					<p className="text-xl text-gray-700 font-semibold">{user?.name}</p>
					<br>
					<span>Last active:{''}<TimeAgo datetime={user?.timestamp?.toDate()}/></span>
					</br>
					</div>
					</div>
					<div className="cursor-pointer hover:text-red-500 transition duration 105 transform hover:scale-105 hover:bg-gray-300 hover:shadow rounded">
					<CloseIcon onClick={closeModal}></CloseIcon>
					</div>
					<ScrollToBottom className={RootCSS}>
					{
						messageSnapshot?(
							messageSnapshot.docs?.map((message)=>{
								return <Message
								key={message.id} 
								user={message.data().user}
								message={{
									...message.data(),
									timestamp:message.data()?.timestamp?.toDate().getTime(),}}
									session={session}/>
								})):(<div className="flex item-center justify-center h-full text-center"><h3>Loading...</h3></div>)
					}
					<div className="absolute sender">
					{
						files &&(
							files.map((file,i)=>{
								return <div key={i}><div className="flex justify-end"><CloseIcon onClick={removeImage(i)}></CloseIcon></div><Image src={file} alt="img"/></div>
							})
							)
					}
					</div>
					</ScrollToBottom>
					<div className="flex justify-between">
					<form>
					<input type="text" placeholder="Type here" ref={chatRef} className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none"></input>
					<div   className="inputIcon flex items-center hover:bg-gray-100 flex-grow justify-content p-2 rounded-xl curser-pointer">
					<CameraIcon className="text-green-400 h-7"/>
					<p className="text-xs sm:text-sm xl:text-base">Photo/Video</p>  
					<input hidden type="file" onChange={handleFileUpload} ref={filePickerRef} multiple="multiple"accept="image/*"/>
					</div>
					<input hidden type="submit" value="send"onClick={sendChat}></input>
					</form>
					</div>
					
					</Modal>
					</>
					)
			})
		}
		</div>
		</>
		)
}
export default Contact;
export async function  getServerSideProps(context){
	const messages=await db.collection('chat').orderBy('')
}