import axios from "axios";

export const getPosts = async (page = 1) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=6`
  );

  return data;
};



export const getPendingUser = async()=>{
    
}

export const search = async()=>{

}


export const toggleAccepDelete = async()=>{

}


export const deleteVotingUser= async()=>{

}


export const IncrementVotes = async()=>{
    
}