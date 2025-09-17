import { useRef, useState } from "react";
import axiosFe from "../../../axios/fe";
import WithNavbar from "../../../components/WithNavbar";
import getBaseUrl from "../../../helpers/getBaseUrl";

function Search(){
    const [keywords,setKeywords] = useState<Set<String>>(new Set())
    const keywordRef = useRef<HTMLInputElement>(null)
    const addKeyword = ()=>{
        const keyword = keywordRef.current?.value
        keywordRef.current!.value = ""
        if(!keyword || keyword === "") return
        if(keywords.has(keyword)) return
        setKeywords((prev) => {
            const temp = new Set(prev)
            temp.add(keyword)
            return temp
        })
    }
    const searchUsers = async()=>{
        if(keywords.size < 1){
            alert("enter keywords")
            return
        }
        axiosFe.get(getBaseUrl()+"/api/twitter/find-by/search",{
            params:{
                keywords : Array.from(keywords).join(",")
            }
        })
    }
    return(
        <WithNavbar navBarName="leadGen">
            <form onSubmit={(e)=>{e.preventDefault()}}>
                <p className="theme-text-accent">Search</p>
                <br/>
                {Array.from(keywords).map(key => <p className="theme-text-accent">{key}</p>)}
                <input ref={keywordRef} type="type"></input>&npsp;
                <button className=" bg-primary theme-text" onClick={addKeyword}>Add keyword</button>
                <br/>
                <br/>
                <button onClick={searchUsers} className=" bg-primary theme-text">Search</button>
            </form>
        </WithNavbar>
    )
}

export default Search